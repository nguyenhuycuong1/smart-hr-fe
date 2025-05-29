import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAttendanceComponent } from './list-attendance/list-attendance.component';
import { PersonnalAttendanceDataComponent } from './personnal-attendance-data/personnal-attendance-data.component';
import { ListAttendanceAdjustmentComponent } from './list-attendance-adjustment/list-attendance-adjustment.component';
import { ListOvertimeRequestComponent } from './list-overtime-request/list-overtime-request.component';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
import { AuthGuard } from '../../guard/auth.guard';

const routes: Routes = [
  {
    path: 'list-attendance',
    component: ListAttendanceComponent,
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_ATTENDANCE_LIST_ATTENDANCE_VIEW] },
    canActivate: [AuthGuard],
  },
  {
    path: 'personal-attendance/:employeeCode',
    component: PersonnalAttendanceDataComponent,
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_ATTENDANCE_PERSONAL_ATTENDANCE_DATA_VIEW] },
    canActivate: [AuthGuard],
  },
  {
    path: 'list-attendance-adjustment',
    component: ListAttendanceAdjustmentComponent,
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_VIEW] },
    canActivate: [AuthGuard],
  },
  {
    path: 'list-overtime-request',
    component: ListOvertimeRequestComponent,
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_VIEW] },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAttendanceRoutingModule {}
