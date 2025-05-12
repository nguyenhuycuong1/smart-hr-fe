import { Component, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { Breadcrumb, InterviewSchedule } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { BaseService } from '../../../services/app-service/base.service';

@Component({
  selector: 'app-interview-schedule',
  standalone: false,
  templateUrl: './interview-schedule.component.html',
  styleUrl: './interview-schedule.component.scss',
})
export class InterviewScheduleComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Lịch phỏng vấn', link: 'manage-recruitment/interview-schedule' },
  ];
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: viLocale,
    headerToolbar: {
      left: '',
      center: 'title',
      right: '', // user can switch between the two
    },
    buttonText: {
      today: 'Hôm nay',
      month: 'Tháng',
      week: 'Tuần',
      day: 'Ngày',
      list: 'Danh sách',
    },
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
    },

    editable: true,

    eventClick: (info) => {
      const event: InterviewSchedule = {
        ...info.event.extendedProps,
        title: info.event.title,
        id: Number(info.event.id),
      };
      this.showPopupUpdateInterviewSchedule(event);
    },

    eventDrop: (info) => {
      const event: InterviewSchedule = {
        ...info.event.extendedProps,
        title: info.event.title,
        id: Number(info.event.id),
        start_time: info.event.start || new Date(),
        end_time: info.event.end || new Date(),
      };
      this.currentInterviewSession = event;
      this.updateInterviewSession();
    },

    eventResize: (info) => {
      const event: InterviewSchedule = {
        ...info.event.extendedProps,
        title: info.event.title,
        id: Number(info.event.id),
        start_time: info.event.start || new Date(),
        end_time: info.event.end || new Date(),
      };
      this.currentInterviewSession = event;
      this.updateInterviewSession();
    },
  };

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarApi: Calendar = {} as Calendar;
  interviewSessions: any[] = [];

  viewMode: 'table' | 'calendar' = 'calendar';
  weekOffset = 0;
  currentWeek: any = new Date();

  constructor(
    private store: Store<AppState>,
    private manageRecruitment: ManageRecruitmentService,
    private message: NzMessageService,
    private baseService: BaseService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getListInterviewSession();
    this.currentWeek = this.getWeekRangeString(new Date(), this.weekOffset);
  }

  getWeekRangeString(date: Date, weekOffset: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + weekOffset * 7);

    // Adjust to the beginning of the week (Monday)
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

    const startOfWeek = new Date(result);
    startOfWeek.setDate(diff);

    // Calculate end of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format dates as strings
    const startDay = startOfWeek.getDate();
    const startMonth = startOfWeek.getMonth() + 1;
    const endDay = endOfWeek.getDate();
    const endMonth = endOfWeek.getMonth() + 1;

    return `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
  }

  previousWeek() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.prev();
    }
    this.weekOffset--;
    this.currentWeek = this.getWeekRangeString(new Date(), this.weekOffset);
    this.getListInterviewSession();
  }

  nextWeek() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.next();
    }
    this.weekOffset++;
    this.currentWeek = this.getWeekRangeString(new Date(), this.weekOffset);
    this.getListInterviewSession();
  }

  resetToCurrentWeek() {
    this.weekOffset = 0;
    this.currentWeek = this.getWeekRangeString(new Date(), this.weekOffset);
    this.getListInterviewSession();
  }

  getListInterviewSession() {
    this.manageRecruitment
      .getInterviewSessionByWeek(new Date(), this.weekOffset)
      .subscribe((res) => {
        console.log(res);
        if (res.data)
          this.events = res.data.map((item: any) => {
            return {
              ...item,
              start: new Date(item.start_time),
              end: new Date(item.end_time),
              backgroundColor: '#17a2b8',
              borderColor: '#17a2b8',
            };
          });
        this.calendarOptions.events = this.events;
        console.log(this.calendarOptions);
      });
  }

  deleteInterviewSession() {
    this.manageRecruitment.deleteInterviewSession(this.currentInterviewSession.id || -1).subscribe({
      next: (res) => {
        this.getListInterviewSession();
        this.message.success('Thành công!');
      },
      error: (err) => {
        console.log(err);
        this.message.error(err.error.result.message);
      },
    });
  }

  updateInterviewSession() {
    if (!this.baseService.isCheckRoles([SYSTEM_ROLES.MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_EDIT])) {
      this.message.warning('Bạn không có quyền thực hiện chức năng này!');
      return;
    }
    this.manageRecruitment.updateInterviewSession(this.currentInterviewSession).subscribe({
      next: (res) => {
        this.getListInterviewSession();
        this.message.success('Thành công!');
      },
      error: (err) => {
        console.log(err);
        this.message.error(err.error.result.message);
      },
    });
  }

  isVisiblePopupCreateInterviewSchedule = false;
  showPopupCreateInterviewSchedule() {
    this.isVisiblePopupCreateInterviewSchedule = true;
  }

  currentInterviewSession: InterviewSchedule = {};
  isVisiblePopupUpdateInterviewSchedule: boolean = false;
  showPopupUpdateInterviewSchedule(data: InterviewSchedule) {
    this.currentInterviewSession = data;
    this.isVisiblePopupUpdateInterviewSchedule = true;
  }

  isVisiblePopupConfirmToDelete: boolean = false;
  showPopupConfirmToDelete(data: InterviewSchedule) {
    this.currentInterviewSession = data;
    this.isVisiblePopupConfirmToDelete = true;
  }

  events: any[] = [];

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
