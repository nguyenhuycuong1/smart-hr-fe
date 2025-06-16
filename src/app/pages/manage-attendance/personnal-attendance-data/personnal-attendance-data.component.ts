import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  AttendanceRecord,
  Breadcrumb,
  PageFilterRequest,
  PageResponse,
  ApiResponse,
} from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { ManageAttendanceService } from '../manage-attendance.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { KeycloakService } from 'keycloak-angular';
import { UserAccountService } from '../../../services/user-account/user-account.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-personnal-attendance-data',
  standalone: false,
  templateUrl: './personnal-attendance-data.component.html',
  styleUrl: './personnal-attendance-data.component.scss',
})
export class PersonnalAttendanceDataComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;

  breadcrumbs: Breadcrumb[] = [
    { link: '/welcome', title: 'Trang chủ' },
    { link: '/manage-attendance/personal-attendance', title: 'Dữ liệu chấm công' },
  ];
  employeeCode: string | undefined = '';
  isLoadingCheckIn: boolean = false;
  isLoadingCheckOut: boolean = false;
  showCheckInButton: boolean = true;
  showCheckOutButton: boolean = false;
  currentAttendanceId: number | null = null;

  // Thuộc tính cho popup xem chi tiết
  currentAttendanceRecord: AttendanceRecord = {};
  isViewAttendanceVisible: boolean = false;

  eventsCalendar: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'listYear',
    locale: viLocale,
    headerToolbar: {
      left: '',
      center: '',
      right: '', // user can switch between the two
    },
    buttonText: {
      today: 'Hôm nay',
      month: 'Tháng',
      week: 'Tuần',
      day: 'Ngày',
      list: 'Danh sách',
    },
    height: '400px',
    weekText: 'Tuần',
    allDayText: 'Cả ngày',
    moreLinkText: 'Xem thêm',
    noEventsText: 'Không có sự kiện',
    // slotMinTime: '00:00:00', // Thời gian bắt đầu hiển thị trên lịch
    // slotMaxTime: '24:00:00', // Thời gian kết thúc hiển thị trên lịch
    // slotDuration: '01:00:00', // Độ chia nhỏ của thời gian (30 phút)
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: false,
      hour12: false, // Định dạng 24 giờ
    }, // direction: 'rtl', // Right-to-left có thể đảo ngược một số hiển thị
    eventClick: (info) => {
      const attendance: AttendanceRecord = {
        id: Number(info.event.id),
        ...info.event.extendedProps,
      };

      // Mở popup xem chi tiết
      this.currentAttendanceRecord = attendance;
      this.isViewAttendanceVisible = true;
    },
  };

  constructor(
    private store: Store<AppState>,
    private attendanceService: ManageAttendanceService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private userAccountService: UserAccountService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
    this.employeeCode = this.route.snapshot.paramMap.get('employeeCode')?.toString();

    this.userAccountService.checkEmployeeCodeAuthorization(this.employeeCode || '');
  }
  ngOnInit() {
    if (this.employeeCode) {
      this.getDataAttendance();
      this.checkTodayAttendance();
      this.getMonthlyAttendanceSummary();
    }
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  // Kiểm tra xem người dùng đã check-in hôm nay chưa và hiển thị nút phù hợp
  checkTodayAttendance() {
    if (!this.employeeCode) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const request: PageFilterRequest<AttendanceRecord> = {
      pageNumber: 0,
      pageSize: 1,
      filter: {
        employee_code: this.employeeCode,
        work_date: todayStr,
      },
      sortOrder: 'DESC',
      sortProperty: 'workDate',
    };

    this.attendanceService.getListAttendance(request).subscribe({
      next: (res: PageResponse<AttendanceRecord[]>) => {
        const todayRecord = res.data && res.data.length > 0 ? res.data[0] : null;

        if (todayRecord) {
          // Nếu đã có bản ghi chấm công hôm nay
          if (todayRecord.check_out_time) {
            // Đã check-out
            this.showCheckInButton = true;
            this.showCheckOutButton = false;
            this.currentAttendanceId = null;
          } else {
            // Đã check-in nhưng chưa check-out
            this.showCheckInButton = false;
            this.showCheckOutButton = true;
            this.currentAttendanceId = todayRecord.id || null;
          }
        } else {
          // Chưa có bản ghi hôm nay
          this.showCheckInButton = true;
          this.showCheckOutButton = false;
        }
      },
      error: (err) => {
        console.error('Error checking today attendance:', err);
      },
    });
  }

  getDataAttendance() {
    const request: PageFilterRequest<AttendanceRecord> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: {
        employee_code: this.employeeCode,
      },
      sortOrder: 'DESC',
      sortProperty: 'workDate',
    };
    this.attendanceService.getListAttendance(request).subscribe({
      next: (res: PageResponse<AttendanceRecord[]>) => {
        this.listAttendance = res.data || [];
        this.total = res.dataCount;
        this.eventsCalendar = this.createEventsCalendar(this.listAttendance);
        console.log('Events Calendar:', this.eventsCalendar);

        // Update calendar with new events using the API
        if (this.calendarComponent && this.calendarComponent.getApi()) {
          const calendarApi = this.calendarComponent.getApi();

          // Remove all existing events first
          calendarApi.removeAllEvents();

          // Add the new events
          calendarApi.addEventSource(this.eventsCalendar);
        } else {
          // Fallback if API is not available
          this.calendarOptions = {
            ...this.calendarOptions,
            events: [...this.eventsCalendar],
          };
        }
      },
      error: (err) => {
        this.message.error(err.error.result.message);
      },
    });
  }

  getMonthlyAttendanceSummary() {
    if (!this.employeeCode) {
      this.message.warning('Không tìm thấy mã nhân viên');
      return;
    }

    this.attendanceService.getMonthlySummary(this.employeeCode).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.result.success) {
          // this.message.success('Lấy dữ liệu thành công!');
          this.dataAttendanceSummary = res.data;
        } else {
          this.message.warning(res.result.message || 'Lấy dữ liệu không thành công');
        }
      },
      error: (err) => {
        console.error('Error fetching monthly summary:', err);
        this.message.error(err.error?.result?.message || 'Có lỗi xảy ra khi lấy dữ liệu');
      },
    });
  }

  checkIn() {
    if (!this.employeeCode) {
      this.message.warning('Không tìm thấy mã nhân viên');
      return;
    }

    this.isLoadingCheckIn = true;
    this.attendanceService.checkIn(this.employeeCode).subscribe({
      next: (res: ApiResponse<AttendanceRecord>) => {
        if (res.result.success) {
          this.message.success('Check-in thành công!');
          this.dataAttendance = res.data as AttendanceRecord;
          this.currentAttendanceId = res.data?.id || null;

          // Chuyển đổi trạng thái hiển thị nút
          this.showCheckInButton = false;
          this.showCheckOutButton = true;

          // Cập nhật lại danh sách chấm công
          this.getDataAttendance();
        } else {
          this.message.warning(res.result.message || 'Check-in không thành công');
        }
      },
      error: (err) => {
        console.error('Check-in error:', err);
        this.message.error(err.error?.result?.message || 'Có lỗi xảy ra khi check-in');
      },
      complete: () => {
        this.isLoadingCheckIn = false;
      },
    });
  }

  checkOut() {
    if (!this.employeeCode || !this.currentAttendanceId) {
      this.message.warning('Không tìm thấy thông tin chấm công');
      return;
    }

    this.isLoadingCheckOut = true;
    this.attendanceService.checkOut(this.employeeCode, this.currentAttendanceId).subscribe({
      next: (res: ApiResponse<AttendanceRecord>) => {
        if (res.result.success) {
          this.message.success('Check-out thành công!');
          this.dataAttendance = res.data as AttendanceRecord;

          // Chuyển đổi trạng thái hiển thị nút
          this.showCheckInButton = true;
          this.showCheckOutButton = false;
          this.currentAttendanceId = null;

          // Cập nhật lại danh sách chấm công
          this.getDataAttendance();
          this.getMonthlyAttendanceSummary();
        } else {
          this.message.warning(res.result.message || 'Check-out không thành công');
        }
      },
      error: (err) => {
        console.error('Check-out error:', err);
        this.message.error(err.error?.result?.message || 'Có lỗi xảy ra khi check-out');
      },
      complete: () => {
        this.isLoadingCheckOut = false;
      },
    });
  }

  createEventsCalendar(listAttendance: AttendanceRecord[]): any[] {
    const eventsCalendar: any[] = [];

    listAttendance.forEach((attendance) => {
      // Create check-in event if check_in_time exists
      if (attendance.check_in_time) {
        const checkInEvent: any = {
          ...attendance,
          id: `${attendance.id}-check-in`, // Thêm hậu tố để tạo ID duy nhất
          title: `Check in - ${attendance.employee_code}`,
          start: new Date(`${attendance.work_date}T${attendance.check_in_time}`),
          type: 'check-in',
          status: attendance.status,
          // color: '#355665',
        };
        eventsCalendar.push(checkInEvent);
      }

      // Create check-out event if check_out_time exists
      if (attendance.check_out_time) {
        const checkOutEvent: any = {
          ...attendance,
          id: `${attendance.id}-check-out`, // Thêm hậu tố để tạo ID duy nhất
          title: `Check out - ${attendance.employee_code}`,
          start: new Date(`${attendance.work_date}T${attendance.check_out_time}`),
          type: 'check-out',
          status: attendance.status,
        };
        eventsCalendar.push(checkOutEvent);
      }
    });

    return eventsCalendar;
  }

  listAttendance: AttendanceRecord[] = [];

  pageNumber: number = 1;
  pageSize: number = 7;
  total: number = 0;

  dataAttendance: AttendanceRecord = {};
  dataAttendanceSummary: any = {};

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
