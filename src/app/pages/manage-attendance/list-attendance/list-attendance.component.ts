import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import {
  AttendanceRecord,
  AttendanceStatus,
  Breadcrumb,
  PageFilterRequest,
  PageResponse,
} from '../../../shared/models';
import { ManageAttendanceService } from '../manage-attendance.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UserAccountService } from '../../../services/user-account/user-account.service';

@Component({
  standalone: false,
  selector: 'app-list-attendance',
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.scss'],
})
export class ListAttendanceComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách điểm danh', link: '/manage-attendance/list-attendance' },
  ];

  currentEmployeeCode: string = '';
  showSearchEmployeeCode: boolean = true;

  isLoading: boolean = false;
  listAttendance: AttendanceRecord[] = [];
  pageNumber: number = 1;
  pageSize: number = 40;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  // For popup confirm delete
  isVisiblePopupConfirm: boolean = false;
  currentAttendance: AttendanceRecord | null = null;

  constructor(
    private store: Store<AppState>,
    private attendanceService: ManageAttendanceService,
    private message: NzMessageService,
    private userAccountService: UserAccountService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.checkPermissionViewAllData();
    // this.getListAttendance();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  checkPermissionViewAllData() {
    this.userAccountService
      .checkRoleAuthorization([SYSTEM_ROLES.MANAGE_ATTENDANCE_LIST_ATTENDANCE_EDIT]) // chỉ những tài khoản có quyền edit chấm công mới xem được toàn bộ data
      .then((hasRole) => {
        this.showSearchEmployeeCode = hasRole;
        if (!hasRole) {
          this.userAccountService.getCurrentEmployeeCodeInAccount().subscribe({
            next: (employeeCode: string) => {
              this.currentEmployeeCode = employeeCode;
              this.searchFilter.employee_code = employeeCode;
              this.getListAttendance();
            },
            error: (err) => {
              console.error(err);
              this.message.error('Có lỗi xảy ra khi lấy thông tin nhân viên');
            },
          });
        } else {
          this.getListAttendance();
        }
      });
  }

  getListAttendance() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'workDate',
      sortOrder: 'DESC',
    };

    this.attendanceService.getListAttendance(request).subscribe({
      next: (res: PageResponse<AttendanceRecord[]>) => {
        this.listAttendance = res.data || [];
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
        this.getListAttendance();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListAttendance();
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
    this.getListAttendance();
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
    this.getListAttendance();
  }

  handleClearSearch(keyName: string) {
    this.searchFilter[keyName] = '';
    this.getListAttendance();
  }

  // Thêm biến cho popup
  isvisiblePopupCreateAttendance: boolean = false;
  isvisiblePopupEditAttendance: boolean = false;
  isvisiblePopupViewAttendance: boolean = false;

  showPopupCreateAttendance() {
    this.isvisiblePopupCreateAttendance = true;
  }

  showPopupEditAttendance(data: AttendanceRecord) {
    this.isvisiblePopupEditAttendance = true;
    this.currentAttendance = data;
  }

  showPopupViewAttendance(data: AttendanceRecord) {
    this.isvisiblePopupViewAttendance = true;
    this.currentAttendance = data;
  }

  showPopupConfirmToDelete(data: AttendanceRecord) {
    this.isVisiblePopupConfirm = true;
    this.currentAttendance = data;
  }

  handleDeleteAttendance() {
    if (this.currentAttendance && this.currentAttendance.id) {
      this.attendanceService.deleteAttendance(this.currentAttendance.id).subscribe({
        next: (res) => {
          this.message.success('Xóa chấm công thành công');
          this.getListAttendance();
          this.isVisiblePopupConfirm = false;
        },
        error: (err) => {
          console.error(err);
          this.message.error('Có lỗi xảy ra khi xóa dữ liệu');
        },
      });
    }
  }

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
  protected readonly ATTENDANCE_STATUS = AttendanceStatus; // Assuming this is a constant for attendance status
}
