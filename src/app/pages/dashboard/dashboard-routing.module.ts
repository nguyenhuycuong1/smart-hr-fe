import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonnelComponent } from './personnel/personnel.component';
import { AttendanceAndLeaveComponent } from './attendance-and-leave/attendance-and-leave.component';
import { AuthGuard } from '../../guard/auth.guard';
import { SYSTEM_ROLES } from '../../shared/constants/constants';

const routes: Routes = [
  {
    path: 'personnel',
    component: PersonnelComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.DASHBOARD_PERSONNEL],
    },
  },
  {
    path: 'attendance-and-leave',
    component: AttendanceAndLeaveComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.DASHBOARD_ATTENDANCE_AND_LEAVE],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
