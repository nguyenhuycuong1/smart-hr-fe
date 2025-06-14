import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSettingComponent } from './manage-setting.component';
import { DepartmentSettingComponent } from './department-setting/department-setting.component';
import { TeamSettingComponent } from './team-setting/team-setting.component';
import { JobPositionSettingComponent } from './job-position-setting/job-position-setting.component';
import { AuthGuard } from '../../guard/auth.guard';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { WorkScheduleSettingComponent } from './work-schedule-setting/work-schedule-setting.component';
import { LeaveTypeSettingComponent } from './leave-type-setting/leave-type-setting.component';
import { HolidaySettingComponent } from './holiday-setting/holiday-setting.component';
import { MailAccountSettingComponent } from './mail-account-setting/mail-account-setting.component';
import { MailTemplateSettingComponent } from './mail-template-setting/mail-template-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ManageSettingComponent,
    children: [
      {
        path: 'general-setting',
        component: GeneralSettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_GENERAL],
        },
      },
      {
        path: 'department-setting',
        component: DepartmentSettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_LIST_DEPARTMENT_VIEW],
        },
      },
      {
        path: 'team-setting',
        component: TeamSettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_LIST_TEAM_VIEW],
        },
      },
      {
        path: 'job-position-setting',
        component: JobPositionSettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_LIST_JOB_POSITION_VIEW],
        },
      },
      {
        path: 'work-schedule-setting',
        component: WorkScheduleSettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_WORK_SCHEDULE],
        },
      },
      {
        path: 'leave-type-setting',
        component: LeaveTypeSettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_LEAVE_TYPE],
        },
      },
      {
        path: 'holiday-setting',
        component: HolidaySettingComponent,
        canActivate: [AuthGuard],
        data: {
          requiredRole: [SYSTEM_ROLES.MANAGE_SETTING_HOLIDAY],
        },
      },
      {
        path: 'mail-account-setting',
        component: MailAccountSettingComponent,
      },
      {
        path: 'mail-template-setting',
        component: MailTemplateSettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSettingRoutingModule {}
