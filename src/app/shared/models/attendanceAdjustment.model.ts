import { ApprovalStatus } from './approval.status';

export interface AttendanceAdjustment {
  id?: number;
  employee_code?: string;
  work_date?: Date | string;
  original_check_in?: Date | string | null;
  original_check_out?: Date | string | null;
  adjusted_check_in?: Date | string | null;
  adjusted_check_out?: Date | string | null;
  reason?: string;
  status?: ApprovalStatus;
  approved_by?: string;
  approved_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
