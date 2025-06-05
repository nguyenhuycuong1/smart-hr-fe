import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../store/models';
import { Store } from '@ngrx/store';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageLeaveService } from '../manage-leave.service';
import {
  ApprovalStatus,
  LeaveBalance,
  LeaveType,
  PageFilterRequest,
  PageResponse,
} from '../../../shared/models';
import { LeaveRequest } from '../../../shared/models/leaveRequest.model';
import { UserAccountService } from '../../../services/user-account/user-account.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';

@Component({
  selector: 'app-my-leave-request',
  standalone: false,
  templateUrl: './my-leave-request.component.html',
  styleUrls: ['./my-leave-request.component.scss'],
})
export class MyLeaveRequestComponent implements OnInit, OnDestroy {
  breadcrumbs = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Yêu cầu nghỉ phép của tôi', link: '/manage-leave/my-leave-requests' },
  ];

  currentEmployeeCode: string = '';

  isLoading: boolean = false;

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;

  // Search
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  leaveBlance: LeaveBalance[] = [];
  listMyLeaveRequests: LeaveRequest[] = [];
  // Popup state
  isPopupCreateLeaveRequestVisible: boolean = false;
  isPopupEditLeaveRequestVisible: boolean = false;
  isPopupViewLeaveRequestVisible: boolean = false;
  currentLeaveRequest: LeaveRequest = {};

  constructor(
    private store: Store<AppState>,
    private message: NzMessageService,
    private manageLeaveService: ManageLeaveService,
    private userAccountService: UserAccountService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.userAccountService.getCurrentEmployeeCodeInAccount().subscribe((code) => {
      this.currentEmployeeCode = code;
      this.searchFilter.employee_code = code;
      this.getListMyLeaveRequests();
      this.getLeaveBalanceOfCurrentEmployee();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  setupSearchDebounce() {
    this.searchTerms
      .pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe((term) => {
        this.common = term;
        this.getListMyLeaveRequests();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListMyLeaveRequests();
    }
  }

  onSearchFilterDate(keyName: string) {
    if (!this.searchFilter[keyName]) {
      this.searchFilter[keyName] = '';
    } else {
      const date = new Date(this.searchFilter[keyName]);
      if (date instanceof Date && !isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.searchFilter[keyName] = `${year}-${month}-${day}`;
      }
    }
    this.getListMyLeaveRequests();
  }

  handleClearSearch(keyName: string) {
    this.searchFilter[keyName] = '';
    this.getListMyLeaveRequests();
  }
  getLeaveBalanceOfCurrentEmployee() {
    this.manageLeaveService.getLeaveBalance(this.currentEmployeeCode).subscribe({
      next: (res) => {
        this.leaveBlance = res.data || [];
      },
      error: (error) => {
        // Handle HTTP error
        this.message.error(error.message || 'An error occurred while fetching leave balance');
      },
    });
  }

  getListMyLeaveRequests() {
    this.isLoading = true;
    const request: PageFilterRequest<LeaveRequest> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'createdAt',
      sortOrder: 'DESC',
    };

    this.manageLeaveService.searchLeaveRequests(request).subscribe({
      next: (res: PageResponse<LeaveRequest[]>) => {
        this.listMyLeaveRequests = res.data || [];
        this.total = res.dataCount || 0;
      },
      error: (error) => {
        // Handle HTTP error
        this.message.error(error.message || 'An error occurred while fetching leave requests');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleDeleteLeaveRequest() {
    if (!this.currentLeaveRequest.id) {
      this.message.error('Không tìm thấy ID yêu cầu nghỉ phép');
      return;
    }

    this.isLoading = true;
    this.manageLeaveService.deleteLeaveRequest(this.currentLeaveRequest.id).subscribe({
      next: (res) => {
        this.message.success('Xóa yêu cầu nghỉ phép thành công');
        this.isvisiblePopupConfirmDelete = false;
        this.getListMyLeaveRequests();
      },
      error: (error) => {
        this.message.error(error.message || 'Có lỗi xảy ra khi xóa yêu cầu nghỉ phép');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Add methods to handle leave request creation and editing
  showPopupCreateLeaveRequest(leaveType?: LeaveBalance) {
    this.isPopupCreateLeaveRequestVisible = true;
    if (leaveType) {
      this.currentLeaveRequest.leave_type_id = leaveType.leave_type_id;
      console.log(this.currentLeaveRequest);
    } else {
      this.currentLeaveRequest.leave_type_id = undefined;
    }
  }
  showPopupEditLeaveRequest(leaveRequest: LeaveRequest) {
    this.currentLeaveRequest = { ...leaveRequest };
    this.isPopupEditLeaveRequestVisible = true;
  }

  showPopupViewLeaveRequest(leaveRequest: LeaveRequest) {
    this.currentLeaveRequest = { ...leaveRequest };
    this.isPopupViewLeaveRequestVisible = true;
  }

  isvisiblePopupConfirmDelete: boolean = false;
  showPopupConfirmDelete(leaveRequest: LeaveRequest) {
    this.currentLeaveRequest = { ...leaveRequest };
    this.isvisiblePopupConfirmDelete = true;
  }

  protected readonly APPROVAL_STATUS = ApprovalStatus;
  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
