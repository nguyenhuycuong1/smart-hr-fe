import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAttendanceRoutingModule } from './manage-attendance-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ManageAttendanceRoutingModule, ComponentsModule],
})
export class ManageAttendanceModule {}
