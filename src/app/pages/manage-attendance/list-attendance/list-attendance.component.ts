import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { Breadcrumb, PageFilterRequest } from '../../../shared/models';
import { ManageAttendanceService } from '../manage-attendance.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';

@Component({
  selector: 'app-list-attendance',
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.scss'],
})
export class ListAttendanceComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/' },
    { title: 'Quản lý điểm danh', link: '/manage-attendance' },
    { title: 'Danh sách điểm danh', link: '/manage-attendance/list-attendance' },
  ];

  constructor(
    private store: Store<AppState>,
    private attendanceService: ManageAttendanceService,
    private message: NzMessageService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    // Initialize component
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
