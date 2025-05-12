import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentRequestComponent } from './recruitment-request/recruitment-request.component';
import { AuthGuard } from '../../guard/auth.guard';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
import { ListJobPostComponent } from './list-job-post/list-job-post.component';
import { ListCandidateComponent } from './list-candidate/list-candidate.component';
import { PipelineRecruitmentComponent } from './pipeline-recruitment/pipeline-recruitment.component';
import { ConvertToEmployeeComponent } from './convert-to-employee/convert-to-employee.component';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';

const routes: Routes = [
  {
    path: 'recruitment-request',
    component: RecruitmentRequestComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_VIEW] },
  },
  {
    path: 'list-job-post',
    component: ListJobPostComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT_JOB_POST_VIEW] },
  },
  {
    path: 'list-candidate',
    component: ListCandidateComponent,
  },
  {
    path: 'pipeline-recruitment',
    component: PipelineRecruitmentComponent,
  },
  {
    path: 'convert-to-employee/:candidateCode',
    component: ConvertToEmployeeComponent,
  },
  {
    path: 'interview-schedule',
    component: InterviewScheduleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRecruitmentRoutingModule {}
