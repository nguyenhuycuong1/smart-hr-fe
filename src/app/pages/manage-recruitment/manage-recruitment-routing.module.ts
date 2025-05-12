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
    canActivate: [AuthGuard],
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT_LIST_CANDIDATE_VIEW] },
  },
  {
    path: 'pipeline-recruitment',
    component: PipelineRecruitmentComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT_PIPELINE_VIEW] },
  },
  {
    path: 'convert-to-employee/:candidateCode',
    component: ConvertToEmployeeComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT_LIST_CANDIDATE_CREATE_CONTRACT] },
  },
  {
    path: 'interview-schedule',
    component: InterviewScheduleComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_VIEW] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRecruitmentRoutingModule {}
