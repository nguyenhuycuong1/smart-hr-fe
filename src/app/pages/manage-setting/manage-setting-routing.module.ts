import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSettingComponent } from './manage-setting.component';
import { DepartmentSettingComponent } from './department-setting/department-setting.component';
import { TeamSettingComponent } from './team-setting/team-setting.component';
import { JobPositionSettingComponent } from './job-position-setting/job-position-setting.component';
import { AuthGuard } from '../../guard/auth.guard';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
const routes: Routes = [
  {
    path: '',
    component: ManageSettingComponent,
    children: [
      {
        path: 'general-setting',
        component: GeneralSettingComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSettingRoutingModule {}
