import { ApprovalStatus } from './approval.status';

export interface OvertimeRequest {
  id?: number;
  employee_code?: string;
  work_date?: Date | string; // Ngày làm việc
  start_time?: Date | string; // Thời gian bắt đầu làm thêm
  end_time?: Date | string; // Thời gian kết thúc làm thêm
  reason?: string; // Lý do làm thêm giờ
  status?: ApprovalStatus;
  approved_by?: string; // Người phê duyệt
  approved_at?: Date; // Thời gian phê duyệt
  created_at?: Date; // Ngày tạo yêu cầu
  updated_at?: Date; // Ngày cập nhật yêu cầu
}
