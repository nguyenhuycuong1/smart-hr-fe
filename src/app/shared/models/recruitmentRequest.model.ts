export interface RecruitmentRequest {
  id?: number;
  recruitment_request_code?: string;
  department_code?: string;
  job_code?: string;
  status?: RecruitmentRequestStatus;
  quantity?: number;
  created_at?: Date;
  created_by?: string;
  username_created?: string;
  updated_at?: Date;
  updated_by?: string;
  username_updated?: string;
}

export interface RecruitmentRequestRecord extends RecruitmentRequest {
  department?: any;
  job_position?: any;
}

export enum RecruitmentRequestStatus {
  KHOITAO = 'KHOITAO',
  DANGDUYET = 'DANGDUYET',
  PHEDUYET = 'PHEDUYET',
  TUCHOI = 'TUCHOI',
  DANGBAI = 'DANGBAI',
  HOANTHANH = 'HOANTHANH',
}
