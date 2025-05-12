export interface InterviewSchedule {
  id?: number;
  title?: string;
  job_post_code?: string;
  description?: string;
  start_time?: Date;
  end_time?: Date;
  location?: string;
  meeting_link?: string;
  candidate_codes?: string[];
  recruiter_codes?: string[];
  note?: string;
}
