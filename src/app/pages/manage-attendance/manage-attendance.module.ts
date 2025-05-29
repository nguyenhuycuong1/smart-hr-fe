import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAttendanceRoutingModule } from './manage-attendance-routing.module';
import { ListAttendanceComponent } from './list-attendance/list-attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../shared/components/components.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { PersonnalAttendanceDataComponent } from './personnal-attendance-data/personnal-attendance-data.component';
import { ListAttendanceAdjustmentComponent } from './list-attendance-adjustment/list-attendance-adjustment.component';
import { PopupCreateAttendanceAdjustmentComponent } from './popup-create-attendance-adjustment/popup-create-attendance-adjustment.component';
import { PopupCreateAttendanceComponent } from './popup-create-attendance/popup-create-attendance.component';
import { PopupViewAttendanceRecordComponent } from './popup-view-attendance-record/popup-view-attendance-record.component';
import { ListOvertimeRequestComponent } from './list-overtime-request/list-overtime-request.component';
import { PopupCreateOvertimeRequestComponent } from './popup-create-overtime-request/popup-create-overtime-request.component';

@NgModule({
  declarations: [
    ListAttendanceComponent,
    PersonnalAttendanceDataComponent,
    ListAttendanceAdjustmentComponent,
    PopupCreateAttendanceAdjustmentComponent,
    PopupCreateAttendanceComponent,
    PopupViewAttendanceRecordComponent,
    ListOvertimeRequestComponent,
    PopupCreateOvertimeRequestComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ManageAttendanceRoutingModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzTypographyModule,
    NzModalModule,
    NzGridModule,
    NzTableModule,
    NzFlexModule,
    NzSelectModule,
    NzDatePickerModule,
    NgxSummernoteModule,
    NzPopoverModule,
    NzTabsModule,
    NzSpinModule,
    NzCardModule,
    DragDropModule,
    NzToolTipModule,
    NzListModule,
    NzStepsModule,
    FullCalendarModule,
    NzRadioModule,
    ReactiveFormsModule,
    NzTimePickerModule,
  ],
})
export class ManageAttendanceModule {}
