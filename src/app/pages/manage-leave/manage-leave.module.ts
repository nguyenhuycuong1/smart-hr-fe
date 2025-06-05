import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageLeaveRoutingModule } from './manage-leave-routing.module';
import { MyLeaveRequestComponent } from './my-leave-request/my-leave-request.component';
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
import { PopupCreateLeaveRequestComponent } from './popup-create-leave-request/popup-create-leave-request.component';
import { PopupViewLeaveRequestComponent } from './popup-view-leave-request/popup-view-leave-request.component';
import { ListLeaveRequestComponent } from './list-leave-request/list-leave-request.component';

@NgModule({
  declarations: [
    MyLeaveRequestComponent,
    PopupCreateLeaveRequestComponent,
    PopupViewLeaveRequestComponent,
    ListLeaveRequestComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ManageLeaveRoutingModule,
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
export class ManageLeaveModule {}
