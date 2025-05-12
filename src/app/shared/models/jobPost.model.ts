import { RecruitmentRequest, RecruitmentRequestRecord } from './recruitmentRequest.model';

export interface JobPost {
  id?: number;
  job_post_code?: string;
  title?: string;
  description?: string;
  request_code?: string;
  created_at?: Date;
  is_open?: boolean;
}

export interface JobPostRecord extends JobPost {
  recruitment_request?: RecruitmentRequestRecord;
}
