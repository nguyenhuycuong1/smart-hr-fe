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
    // Strict time settings to prevent auto-generated events
    slotMinTime: '06:00:00', // Start display at 6 AM
    slotMaxTime: '23:00:00', // End display at 11 PM
    slotDuration: '00:30:00', // 30-minute slots
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: false,
      hour12: false, // 24-hour format
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    timeZone: 'local',
    // Completely disable any automatic events or indicators
    nowIndicator: false,
    dayHeaders: false,
    displayEventTime: true,
    displayEventEnd: false,
    eventDisplay: 'block', // Use block display to prevent automatic formatting
    forceEventDuration: false, // Don't force events to have a duration
    nextDayThreshold: '00:00:00', // Prevent events from spanning to next day
    dayMaxEvents: false, // Don't limit the number of events per day
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
  private calendarObserver: MutationObserver | null = null;

  ngOnInit() {
    if (this.employeeCode) {
      this.getDataAttendance();
      this.checkTodayAttendance();
      this.getMonthlyAttendanceSummary();

      // Setup observer to detect DOM changes (after a short delay to ensure calendar is rendered)
    }
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));

    // Clean up the mutation observer
    if (this.calendarObserver) {
      this.calendarObserver.disconnect();
      this.calendarObserver = null;
    }
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

        // Generate events from attendance records
        this.eventsCalendar = this.createEventsCalendar(this.listAttendance);

        // Update calendar with new events using the API
        if (this.calendarComponent && this.calendarComponent.getApi()) {
          const calendarApi = this.calendarComponent.getApi();

          // Remove all existing events and event sources
          calendarApi.removeAllEvents();
          const sources = calendarApi.getEventSources();
          sources.forEach((source) => {
            source.remove();
          });

          // Set some calendar options that might help with preventing phantom events
          calendarApi.setOption('nextDayThreshold', '00:00:00');
          calendarApi.setOption('businessHours', false);

          // Debug: Check if calendar has any events after clearing
          const remainingEvents = calendarApi.getEvents();

          // Add events as a new source with a unique ID
          const sourceId = 'attendance-events-' + new Date().getTime();

          // Filter out any potential midnight events for ID 23 before adding
          const filteredEvents = this.eventsCalendar.filter((event) => {
            // Skip any events with ID 23 that would occur at midnight
            if (event.id === '23-check-in' && event.start) {
              const date = new Date(event.start);
              return !(date.getHours() === 0 && date.getMinutes() === 0);
            }
            return true;
          });

          // Add events with explicit properties to prevent automatic additions
          calendarApi.addEventSource({
            id: sourceId,
            events: filteredEvents.map((event) => ({
              ...event,
              allDay: false, // Ensure no all-day events
              display: 'block',
              editable: false,
              startEditable: false,
              durationEditable: false,
            })),
          });

          // Debug: Verify final event count and details after a short delay to ensure rendering is complete
          setTimeout(() => {
            const finalEvents = calendarApi.getEvents();
            // Look specifically for the June 18 midnight event that's causing problems
            const midnightEvents = finalEvents.filter((e) => {
              if (!e.start) return false;
              const date = new Date(e.start);
              return (
                date.getDate() === 18 &&
                date.getMonth() === 5 && // June is month 5 (0-indexed)
                date.getHours() === 0 &&
                date.getMinutes() === 0
              );
            });

            if (midnightEvents.length > 0) {
              midnightEvents.forEach((event) => event.remove());
            }
          }, 200);
        } else {
          // Fallback if API is not available
          this.calendarOptions = {
            ...this.calendarOptions,
            events: [...this.eventsCalendar],
          };
        }
      },
      error: (err) => {
        console.error('Error fetching attendance data:', err);
        this.message.error(err.error?.result?.message || 'Có lỗi xảy ra khi lấy dữ liệu');
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
    let eventsCalendar: any[] = [];

    const addedEventIds = new Set<string>();

    listAttendance.forEach((attendance) => {
      // Create check-in event if check_in_time exists
      if (attendance.check_in_time) {
        const eventId = `${attendance.id}-check-in`;

        // Skip if we've already added this event
        if (addedEventIds.has(eventId)) {
        } else {
          // Create a proper date object for check-in
          const checkInDate = new Date(`${attendance.work_date}T${attendance.check_in_time}`);

          const checkInEvent: any = {
            ...attendance,
            id: eventId, // Thêm hậu tố để tạo ID duy nhất
            title: `Check in - ${attendance.employee_code}`,
            start: checkInDate,
            type: 'check-in',
            status: attendance.status,
            // color: '#355665',
          };

          eventsCalendar.push(checkInEvent);
          addedEventIds.add(eventId);
        }
      }

      // Create check-out event if check_out_time exists
      if (attendance.check_out_time) {
        const eventId = `${attendance.id}-check-out`;

        // Skip if we've already added this event
        if (addedEventIds.has(eventId)) {
        } else {
          // Check if this is a night shift by comparing time strings
          const isNightShift =
            attendance.check_in_time &&
            this.isTimeAfter(attendance.check_in_time, attendance.check_out_time);

          // For night shifts, set check-out date to the next day
          let checkOutDate = attendance.work_date;
          if (isNightShift && typeof attendance.work_date === 'string') {
            // Create a new date object for the next day
            const workDate = new Date(attendance.work_date);
            const nextDay = new Date(workDate);
            nextDay.setDate(workDate.getDate() + 1);
            checkOutDate = nextDay.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }

          // Create a proper date object for check-out
          const checkOutDateTime = new Date(`${checkOutDate}T${attendance.check_out_time}`);

          const checkOutEvent: any = {
            ...attendance,
            id: eventId, // Thêm hậu tố để tạo ID duy nhất
            title: `Check out - ${attendance.employee_code}`,
            start: checkOutDateTime,
            type: 'check-out',
            status: attendance.status,
            isNextDay: isNightShift, // Add a flag to indicate if this is on the next day
          };

          eventsCalendar.push(checkOutEvent);
          addedEventIds.add(eventId);
        }
      }
    });
    eventsCalendar = eventsCalendar.map((event) => {
      return {
        ...event,
        end: new Date(new Date(event.start).getTime() + 60_000).toISOString(),
      };
    });
    return eventsCalendar;
  }
  /**
   * Compare two time strings (format: HH:MM:SS)
   * @param time1 First time string
   * @param time2 Second time string
   * @returns true if time1 is after time2
   */
  isTimeAfter(time1: string | Date, time2: string | Date): boolean {
    if (!time1 || !time2) return false;

    // Ensure we're working with strings
    const timeStr1 = typeof time1 === 'string' ? time1 : time1.toTimeString().split(' ')[0];
    const timeStr2 = typeof time2 === 'string' ? time2 : time2.toTimeString().split(' ')[0];

    // Convert time strings to comparable values (seconds since midnight)
    const [hours1, minutes1, seconds1 = '0'] = timeStr1.split(':');
    const [hours2, minutes2, seconds2 = '0'] = timeStr2.split(':');

    const totalSeconds1 = Number(hours1) * 3600 + Number(minutes1) * 60 + Number(seconds1);
    const totalSeconds2 = Number(hours2) * 3600 + Number(minutes2) * 60 + Number(seconds2);

    return totalSeconds1 > totalSeconds2;
  }

  listAttendance: AttendanceRecord[] = [];

  pageNumber: number = 1;
  pageSize: number = 7;
  total: number = 0;

  dataAttendance: AttendanceRecord = {};
  dataAttendanceSummary: any = {};

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
