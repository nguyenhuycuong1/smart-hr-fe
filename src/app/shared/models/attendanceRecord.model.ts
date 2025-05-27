export interface AttendanceRecord {
  id?: number;
  employee_code?: string;
  work_date?: string | Date;
  check_in_time?: string | Date;
  check_out_time?: string | Date;
  total_hours?: number;
  overtime_hours?: number;
  status?: AttendanceStatus;
}

export enum AttendanceStatus {
  BINHTHUONG = 'BINHTHUONG',
  VANG = 'VANG',
  MUON = 'MUON',
  VESOM = 'VESOM',
  THEMGIO = 'THEMGIO',
}
