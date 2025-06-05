import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import {
  ApprovalStatus,
  Breadcrumb,
  PageFilterRequest,
  PageResponse,
} from '../../../shared/models';
import { ManageLeaveService } from '../manage-leave.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { UserAccountService } from '../../../services/user-account/user-account.service';
import { LeaveRequest } from '../../../shared/models/leaveRequest.model';

@Component({
  standalone: false,
  selector: 'app-list-leave-request',
  templateUrl: './list-leave-request.component.html',
  styleUrls: ['./list-leave-request.component.scss'],
})
export class ListLeaveRequestComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    {
      title: 'Danh sách yêu cầu nghỉ phép',
      link: '/manage-leave/list-leave-request',
    },
  ];

  currentEmployeeCode: string = '';
  showSearchEmployeeCode: boolean = true;

  isLoading: boolean = false;
  listLeaveRequests: LeaveRequest[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  // For popup confirm delete
  isVisiblePopupConfirm: boolean = false;
  currentLeaveRequest: LeaveRequest | null = null;

  currentUser: any = null;

  constructor(
    private store: Store<AppState>,
    private leaveService: ManageLeaveService,
    private message: NzMessageService,
    private keycloakService: KeycloakService,
    private userAccountService: UserAccountService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
    this.checkPermissionViewAllData();
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.getListLeaveRequests();
    this.getCurrentUser();
    console.log('check');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  checkPermissionViewAllData() {
    this.userAccountService
      .checkRoleAuthorization([
        SYSTEM_ROLES.MANAGE_LEAVE_LIST_LEAVE_REQUEST_APPROVE,
        SYSTEM_ROLES.MANAGE_LEAVE_LIST_LEAVE_REQUEST_REJECT,
      ]) // chỉ những tài khoản có quyền edit chấm công mới xem được toàn bộ data
      .then((hasRole) => {
        this.showSearchEmployeeCode = hasRole;
        if (!hasRole) {
          this.userAccountService.getCurrentEmployeeCodeInAccount().subscribe({
            next: (employeeCode: string) => {
              this.currentEmployeeCode = employeeCode;
              this.searchFilter.employee_code = employeeCode;
              console.log(this.currentEmployeeCode);
              this.getListLeaveRequests();
            },
            error: (err) => {
              console.error(err);
              this.message.error('Có lỗi xảy ra khi lấy thông tin nhân viên');
            },
          });
        }
      });
  }

  async getCurrentUser() {
    this.currentUser = await this.keycloakService.loadUserProfile().then((profile) => {
      return profile.lastName + ' ' + profile.firstName;
    });
  }

  getListLeaveRequests() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'createdAt',
      sortOrder: 'DESC',
    };

    this.leaveService.searchLeaveRequests(request).subscribe({
      next: (res: PageResponse<LeaveRequest[]>) => {
        this.listLeaveRequests = res.data || [];
        this.total = res.dataCount || 0;
      },
      error: (err) => {
        console.error(err);
        this.message.error('Có lỗi xảy ra khi tải dữ liệu');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  setupSearchDebounce() {
    this.searchTerms
      .pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe((term) => {
        this.common = term;
        this.getListLeaveRequests();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListLeaveRequests();
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
    this.getListLeaveRequests();
  }

  handleClearSearch(keyName: string) {
    this.searchFilter[keyName] = '';
    this.getListLeaveRequests();
  }

  isvisiblePopupCreateLeaveRequest: boolean = false;
  showPopupCreateLeaveRequest() {
    this.isvisiblePopupCreateLeaveRequest = true;
  }

  isvisiblePopupEditLeaveRequest: boolean = false;
  showPopupEditLeaveRequest(data: LeaveRequest) {
    this.isvisiblePopupEditLeaveRequest = true;
    this.currentLeaveRequest = data;
  }

  showPopupConfirmToDelete(data: LeaveRequest) {
    this.isVisiblePopupConfirm = true;
    this.currentLeaveRequest = data;
  }

  handleDeleteLeaveRequest() {
    if (this.currentLeaveRequest && this.currentLeaveRequest.id) {
      this.leaveService.deleteLeaveRequest(this.currentLeaveRequest.id).subscribe({
        next: (res) => {
          this.message.success('Xóa yêu cầu nghỉ phép thành công');
          this.getListLeaveRequests();
          this.isVisiblePopupConfirm = false;
        },
        error: (err) => {
          console.error(err);
          this.message.error('Có lỗi xảy ra khi xóa dữ liệu');
        },
      });
    }
  }

  isvisiblePopupViewLeaveRequest: boolean = false;
  showPopupViewLeaveRequest(data: LeaveRequest) {
    this.isvisiblePopupViewLeaveRequest = true;
    this.currentLeaveRequest = data;
  }

  isShowPopupApproveLeaveRequest: boolean = false;
  showPopupApproveLeaveRequest(data: LeaveRequest) {
    this.isShowPopupApproveLeaveRequest = true;
    this.currentLeaveRequest = data;
  }

  isShowPopupRejectLeaveRequest: boolean = false;
  showPopupRejectLeaveRequest(data: LeaveRequest) {
    this.isShowPopupRejectLeaveRequest = true;
    this.currentLeaveRequest = data;
  }

  handleApproveLeaveRequest() {
    if (this.currentLeaveRequest && this.currentLeaveRequest.id) {
      this.leaveService
        .approveLeaveRequest(this.currentLeaveRequest.id, this.currentUser)
        .subscribe({
          next: (res) => {
            this.message.success('Phê duyệt yêu cầu nghỉ phép thành công');
            this.getListLeaveRequests();
            this.isShowPopupApproveLeaveRequest = false;
          },
          error: (err) => {
            console.error(err);
            this.message.error(err.error.result.message || 'Có lỗi xảy ra khi phê duyệt dữ liệu');
          },
        });
    }
  }

  handleRejectLeaveRequest() {
    if (this.currentLeaveRequest && this.currentLeaveRequest.id) {
      this.leaveService
        .rejectLeaveRequest(this.currentLeaveRequest.id, this.currentUser)
        .subscribe({
          next: (res) => {
            this.message.success('Từ chối yêu cầu nghỉ phép thành công');
            this.getListLeaveRequests();
            this.isShowPopupRejectLeaveRequest = false;
          },
          error: (err) => {
            console.error(err);
            this.message.error(err.error.result.message || 'Có lỗi xảy ra khi từ chối dữ liệu');
          },
        });
    }
  }

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
  protected readonly APPROVAL_STATUS = ApprovalStatus;
}
