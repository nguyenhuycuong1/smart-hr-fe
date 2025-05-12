export interface Candidate {
  id?: number;
  candidate_code?: string;
  job_post_code?: string;
  job_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  resume_url?: string;
  status?: CandidateStatus;
  applied_at?: Date;
  gender?: string;
  address?: string;
  current_address?: string;
  dob?: Date;
}

export enum CandidateStatus {
  KHOITAO = 'KHOITAO',
  DANGUNGTUYEN = 'DANGUNGTUYEN',
  KHONGDAT = 'KHONGDAT',
  TRUNGTUYEN = 'TRUNGTUYEN',
  NHANVIEC = 'NHANVIEC',
}
