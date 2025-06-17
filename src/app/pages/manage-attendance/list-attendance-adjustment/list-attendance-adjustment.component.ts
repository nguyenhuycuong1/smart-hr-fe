import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import {
  AttendanceAdjustment,
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
  selector: 'app-list-attendance-adjustment',
  templateUrl: './list-attendance-adjustment.component.html',
  styleUrls: ['./list-attendance-adjustment.component.scss'],
})
export class ListAttendanceAdjustmentComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    {
      title: 'Danh sách điều chỉnh chấm công',
      link: '/manage-attendance/list-attendance-adjustment',
    },
  ];

  currentEmployeeCode: string = '';
  showSearchEmployeeCode: boolean = true;

  isLoading: boolean = false;
  listAdjustments: AttendanceAdjustment[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  // For popup confirm delete
  isVisiblePopupConfirm: boolean = false;
  currentAdjustment: AttendanceAdjustment | null = null;

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
      .checkRoleAuthorization([SYSTEM_ROLES.MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_EDIT]) // chỉ những tài khoản có quyền phê duyệt mới xem được toàn bộ data
      .then((hasRole) => {
        this.showSearchEmployeeCode = hasRole;
        if (!hasRole) {
          this.userAccountService.getCurrentEmployeeCodeInAccount().subscribe({
            next: (employeeCode: string) => {
              this.currentEmployeeCode = employeeCode;
              this.searchFilter.employee_code = employeeCode;
              this.getListAdjustments();
            },
            error: (err) => {
              console.error(err);
              this.message.error('Có lỗi xảy ra khi lấy thông tin nhân viên');
            },
          });
        } else {
          this.getListAdjustments();
        }
      });
  }

  getListAdjustments() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'createdAt',
      sortOrder: 'DESC',
    };

    this.attendanceService.getListAttendanceAdjustments(request).subscribe({
      next: (res: PageResponse<AttendanceAdjustment[]>) => {
        this.listAdjustments = res.data || [];
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
        this.getListAdjustments();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  onSearchFilter(event: any) {
    if (event.keyCode == 13) {
      this.getListAdjustments();
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
    this.getListAdjustments();
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
    this.getListAdjustments();
  }

  handleClearSearch(keyName: string) {
    this.searchFilter[keyName] = '';
    this.getListAdjustments();
  }

  isvisiblePopupCreateAdjustment: boolean = false;
  showPopupCreateAdjustment() {
    // Will be implemented when creating popup component
    // console.log('Open create adjustment popup');
    this.isvisiblePopupCreateAdjustment = true;
  }

  isvisiblePopupEditAdjustment: boolean = false;
  showPopupEditAdjustment(data: AttendanceAdjustment) {
    this.isvisiblePopupEditAdjustment = true;
    this.currentAdjustment = data;
    console.log(this.currentAdjustment);
  }

  showPopupConfirmToDelete(data: AttendanceAdjustment) {
    this.isVisiblePopupConfirm = true;
    this.currentAdjustment = data;
  }

  handleDeleteAdjustment() {
    if (this.currentAdjustment && this.currentAdjustment.id) {
      this.attendanceService.deleteAttendanceAdjustment(this.currentAdjustment.id).subscribe({
        next: (res) => {
          this.message.success('Xóa điều chỉnh chấm công thành công');
          this.getListAdjustments();
          this.isVisiblePopupConfirm = false;
        },
        error: (err) => {
          console.error(err);
          this.message.error('Có lỗi xảy ra khi xóa dữ liệu');
        },
      });
    }
  }

  isShowPopupApproveAdjustment: boolean = false;
  showPopupApproveAdjustment(data: AttendanceAdjustment) {
    this.isShowPopupApproveAdjustment = true;
    this.currentAdjustment = data;
  }

  isShowPopupRejectAdjustment: boolean = false;
  showPopupRejectAdjustment(data: AttendanceAdjustment) {
    this.isShowPopupRejectAdjustment = true;
    this.currentAdjustment = data;
  }

  handleApproveAdjustment() {
    if (this.currentAdjustment && this.currentAdjustment.id) {
      this.attendanceService
        .approveAttendanceAdjustment(this.currentAdjustment.id, this.currentUser)
        .subscribe({
          next: (res) => {
            this.message.success('Thành công');
            this.getListAdjustments();
            this.isShowPopupApproveAdjustment = false;
          },
          error: (err) => {
            console.error(err);
            this.message.error(err.error.result.message || 'Có lỗi xảy ra khi phê duyệt dữ liệu');
          },
        });
    }
  }

  handleRejectAdjustment() {
    if (this.currentAdjustment && this.currentAdjustment.id) {
      this.attendanceService
        .rejectAttendanceAdjustment(this.currentAdjustment.id, this.currentUser)
        .subscribe({
          next: (res) => {
            this.message.success('Thành công');
            this.getListAdjustments();
            this.isShowPopupRejectAdjustment = false;
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
