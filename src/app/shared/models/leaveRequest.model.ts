import { ApprovalStatus } from './approval.status';

export interface LeaveRequest {
  id?: number; // Unique identifier for the leave request
  employee_code?: string; // Employee code of the person requesting leave
  leave_type_id?: number; // ID of the leave type
  start_date?: Date; // Start date of the leave in ISO format (YYYY-MM-DD)
  end_date?: Date; // End date of the leave in ISO format (YYYY-MM-DD)
  reason?: string; // Reason for the leave request
  status?: ApprovalStatus; // Status of the leave request (e.g., 'pending', 'approved', 'rejected')
  created_at?: Date; // Timestamp of when the leave request was created
  updated_at?: Date; // Timestamp of when the leave request was last updated
  approved_by?: string; // Employee code of the person who approved the leave request
  approved_at?: Date; // Timestamp of when the leave request was approved
  leave_type_name?: string; // Name of the leave type
  is_paid?: boolean; // Indicates if the leave type is paid or unpaid
  employee_name?: string; // Name of the employee requesting leave
}
