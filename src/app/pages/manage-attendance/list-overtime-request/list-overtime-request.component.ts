import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import {
  OvertimeRequest,
  ApprovalStatus,
  Breadcrumb,
  PageFilterRequest,
  PageResponse,
} from '../../../shared/models';
import { ManageAttendanceService } from '../manage-attendance.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { UserAccountService } from '../../../services/user-account/user-account.service';

@Component({
  standalone: false,
  selector: 'app-list-overtime-request',
  templateUrl: './list-overtime-request.component.html',
  styleUrls: ['./list-overtime-request.component.scss'],
})
export class ListOvertimeRequestComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    {
      title: 'Danh sách yêu cầu làm thêm giờ',
      link: '/manage-attendance/list-overtime-request',
    },
  ];

  currentEmployeeCode: string = '';
  showSearchEmployeeCode: boolean = true;

  isLoading: boolean = false;
  listOvertimeRequests: OvertimeRequest[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  // For popup confirm delete
  isVisiblePopupConfirm: boolean = false;
  currentOvertimeRequest: OvertimeRequest | null = null;

  currentUser: any = null;

  constructor(
    private store: Store<AppState>,
    private attendanceService: ManageAttendanceService,
    private message: NzMessageService,
    private keycloakService: KeycloakService,
    private userAccountService: UserAccountService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.checkPermissionViewAllData();
    this.getCurrentUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  async getCurrentUser() {
    this.currentUser = await this.keycloakService.loadUserProfile().then((profile) => {
      return profile.lastName + ' ' + profile.firstName;
    });
  }

  checkPermissionViewAllData() {
    this.userAccountService
      .checkRoleAuthorization([SYSTEM_ROLES.MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_EDIT]) // chỉ những tài khoản có quyền phê duyệt mới xem được toàn bộ data
      .then((hasRole) => {
        this.showSearchEmployeeCode = hasRole;
        if (!hasRole) {
          this.userAccountService.getCurrentEmployeeCodeInAccount().subscribe({
            next: (employeeCode: string) => {
              this.currentEmployeeCode = employeeCode;
              this.searchFilter.employee_code = employeeCode;
              this.getListOvertimeRequests();
            },
            error: (err) => {
              console.error(err);
              this.message.error('Có lỗi xảy ra khi lấy thông tin nhân viên');
            },
          });
        } else {
          this.getListOvertimeRequests();
        }
      });
  }

  getListOvertimeRequests() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'createdAt',
      sortOrder: 'DESC',
    };

    this.attendanceService.getListOvertimeRequests(request).subscribe({
      next: (res: PageResponse<OvertimeRequest[]>) => {
        this.listOvertimeRequests = res.data || [];
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
        this.getListOvertimeRequests();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListOvertimeRequests();
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
    this.getListOvertimeRequests();
  }

  onSearchFilterTime(keyName: string) {
    if (!this.searchFilter[keyName]) {
      this.searchFilter[keyName] = '';
    } else {
      const time = new Date(this.searchFilter[keyName]);
      if (time instanceof Date && !isNaN(time.getTime())) {
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        this.searchFilter[keyName] = `${hours}:${minutes}`;
      }
    }
    this.getListOvertimeRequests();
  }

  handleClearSearch(keyName: string) {
    this.searchFilter[keyName] = '';
    this.getListOvertimeRequests();
  }

  isvisiblePopupCreateOvertimeRequest: boolean = false;
  showPopupCreateOvertimeRequest() {
    this.isvisiblePopupCreateOvertimeRequest = true;
  }

  isvisiblePopupEditOvertimeRequest: boolean = false;
  showPopupEditOvertimeRequest(data: OvertimeRequest) {
    this.isvisiblePopupEditOvertimeRequest = true;
    this.currentOvertimeRequest = data;
  }

  showPopupConfirmToDelete(data: OvertimeRequest) {
    this.isVisiblePopupConfirm = true;
    this.currentOvertimeRequest = data;
  }

  handleDeleteOvertimeRequest() {
    if (this.currentOvertimeRequest && this.currentOvertimeRequest.id) {
      this.attendanceService.deleteOvertimeRequest(this.currentOvertimeRequest.id).subscribe({
        next: (res) => {
          this.message.success('Xóa yêu cầu làm thêm giờ thành công');
          this.getListOvertimeRequests();
          this.isVisiblePopupConfirm = false;
        },
        error: (err) => {
          console.error(err);
          this.message.error('Có lỗi xảy ra khi xóa dữ liệu');
        },
      });
    }
  }

  isShowPopupApproveOvertimeRequest: boolean = false;
  showPopupApproveOvertimeRequest(data: OvertimeRequest) {
    this.isShowPopupApproveOvertimeRequest = true;
    this.currentOvertimeRequest = data;
  }

  isShowPopupRejectOvertimeRequest: boolean = false;
  showPopupRejectOvertimeRequest(data: OvertimeRequest) {
    this.isShowPopupRejectOvertimeRequest = true;
    this.currentOvertimeRequest = data;
  }

  handleApproveOvertimeRequest() {
    if (this.currentOvertimeRequest && this.currentOvertimeRequest.id) {
      this.attendanceService
        .approveOvertimeRequest(this.currentOvertimeRequest.id, this.currentUser)
        .subscribe({
          next: (res) => {
            this.message.success('Phê duyệt yêu cầu làm thêm giờ thành công');
            this.getListOvertimeRequests();
            this.isShowPopupApproveOvertimeRequest = false;
          },
          error: (err) => {
            console.error(err);
            this.message.error(err.error.result.message || 'Có lỗi xảy ra khi phê duyệt dữ liệu');
          },
        });
    }
  }

  handleRejectOvertimeRequest() {
    if (this.currentOvertimeRequest && this.currentOvertimeRequest.id) {
      this.attendanceService
        .rejectOvertimeRequest(this.currentOvertimeRequest.id, this.currentUser)
        .subscribe({
          next: (res) => {
            this.message.success('Từ chối yêu cầu làm thêm giờ thành công');
            this.getListOvertimeRequests();
            this.isShowPopupRejectOvertimeRequest = false;
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
