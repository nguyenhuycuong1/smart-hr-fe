import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAttendanceComponent } from './list-attendance/list-attendance.component';
import { PersonnalAttendanceDataComponent } from './personnal-attendance-data/personnal-attendance-data.component';
import { ListAttendanceAdjustmentComponent } from './list-attendance-adjustment/list-attendance-adjustment.component';

const routes: Routes = [
  {
    path: 'list-attendance',
    component: ListAttendanceComponent,
  },
  {
    path: 'personal-attendance/:employeeCode',
    component: PersonnalAttendanceDataComponent,
  },
  {
    path: 'list-attendance-adjustment',
    component: ListAttendanceAdjustmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAttendanceRoutingModule {}
