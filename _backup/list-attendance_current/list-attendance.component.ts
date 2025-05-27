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

@Component({
  selector: 'app-list-attendance',
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.scss'],
})
export class ListAttendanceComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách điểm danh', link: '/manage-attendance/list-attendance' },
  ];

  isLoading: boolean = false;
  listAttendance: AttendanceRecord[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
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
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.getListAttendance();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  getListAttendance() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'work_date',
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

  onSearchFilter(event: any) {
    this.getListAttendance();
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
  getStatusClass(status: AttendanceStatus | undefined): string {
    switch (status) {
      case AttendanceStatus.BINHTHUONG:
        return 'shr-status--success';
      case AttendanceStatus.VANG:
        return 'shr-status--warning';
      case AttendanceStatus.MUON:
        return 'shr-status--default';
      case AttendanceStatus.VESOM:
        return 'shr-status--danger';
      case AttendanceStatus.THEMGIO:
        return 'shr-status--info';
      default:
        return '';
    }
  }

  getStatusLabel(status: AttendanceStatus | undefined): string {
    if (status === undefined) return '';

    switch (status) {
      case AttendanceStatus.BINHTHUONG:
        return 'Bình thường';
      case AttendanceStatus.VANG:
        return 'Vắng';
      case AttendanceStatus.MUON:
        return 'Muộn';
      case AttendanceStatus.VESOM:
        return 'Về sớm';
      case AttendanceStatus.THEMGIO:
        return 'Thêm giờ';
      default:
        return '';
    }
  }

  showPopupCreateAttendance() {
    // Will be implemented when creating popup component
    console.log('Open create attendance popup');
  }

  showPopupEditAttendance(data: AttendanceRecord) {
    // Will be implemented when creating popup component
    console.log('Open edit attendance popup', data);
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
