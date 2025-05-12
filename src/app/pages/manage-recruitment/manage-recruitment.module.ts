import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRecruitmentRoutingModule } from './manage-recruitment-routing.module';
import { RecruitmentRequestComponent } from './recruitment-request/recruitment-request.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { PopupCreateRecruitmentRequestComponent } from './popup-create-recruitment-request/popup-create-recruitment-request.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PopupEditRecruitmentRequestComponent } from './popup-edit-recruitment-request/popup-edit-recruitment-request.component';
import { PopupEditJobPostComponent } from './popup-edit-job-post/popup-edit-job-post.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ListJobPostComponent } from './list-job-post/list-job-post.component';
import { PopupCreateJobPostComponent } from './popup-create-job-post/popup-create-job-post.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ListCandidateComponent } from './list-candidate/list-candidate.component';
import { PipelineRecruitmentComponent } from './pipeline-recruitment/pipeline-recruitment.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzListModule } from 'ng-zorro-antd/list';
import { ConvertToEmployeeComponent } from './convert-to-employee/convert-to-employee.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PopupCreateInterviewScheduleComponent } from './popup-create-interview-schedule/popup-create-interview-schedule.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { PopupUpdateInterviewSessionComponent } from './popup-update-interview-session/popup-update-interview-session.component';

@NgModule({
  declarations: [
    RecruitmentRequestComponent,
    PopupCreateRecruitmentRequestComponent,
    PopupEditRecruitmentRequestComponent,
    PopupEditJobPostComponent,
    ListJobPostComponent,
    PopupCreateJobPostComponent,
    ListCandidateComponent,
    PipelineRecruitmentComponent,
    ConvertToEmployeeComponent,
    InterviewScheduleComponent,
    PopupCreateInterviewScheduleComponent,
    PopupUpdateInterviewSessionComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ManageRecruitmentRoutingModule,
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
  ],
})
export class ManageRecruitmentModule {}
