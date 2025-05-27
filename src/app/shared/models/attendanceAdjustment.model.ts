import { ApprovalStatus } from './approval.status';

export interface AttendanceAdjustment {
  id?: number;
  employee_code?: string;
  work_date?: Date | string;
  original_check_in?: Date | string;
  original_check_out?: Date | string;
  adjusted_check_in?: Date | string;
  adjusted_check_out?: Date | string;
  reason?: string;
  status?: ApprovalStatus;
  approved_by?: string;
  approved_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
