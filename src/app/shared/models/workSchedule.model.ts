export interface WorkSchedule {
  id?: number;
  schedule_name?: string;
  start_time?: string; // LocalTime sẽ được map thành string trong FE
  end_time?: string;
  description?: string;
  break_start?: string;
  break_end?: string;
  created_at?: string; // LocalDate sẽ được map thành string trong FE
  updated_at?: string;
}
