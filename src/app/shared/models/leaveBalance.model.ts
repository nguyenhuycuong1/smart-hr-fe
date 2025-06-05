export interface LeaveBalance {
  leave_type_id?: number; // ID of the leave type
  leave_type_name?: string; // Name of the leave type
  max_days_per_year?: number; // Maximum number of leave days allowed per year
  used_days?: number; // Number of leave days already used
  remaining_days?: number; // Number of leave days remaining
  is_paid?: boolean; // Indicates if the leave type is paid or unpaid
}
