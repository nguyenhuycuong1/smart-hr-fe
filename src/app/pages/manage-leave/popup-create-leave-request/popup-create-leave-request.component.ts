import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ApprovalStatus,
  EmployeeRecord,
  LeaveBalance,
  PageFilterRequest,
} from '../../../shared/models';
import { LeaveRequest } from '../../../shared/models/leaveRequest.model';
import { EmployeeService } from '../../../services/employees/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageLeaveService } from '../manage-leave.service';
import { ManageSettingService } from '../../manage-setting/manage-setting.service';
import { UserAccountService } from '../../../services/user-account/user-account.service';

@Component({
  selector: 'app-popup-create-leave-request',
  standalone: false,
  templateUrl: './popup-create-leave-request.component.html',
  styleUrls: ['./popup-create-leave-request.component.scss'],
})
export class PopupCreateLeaveRequestComponent implements OnInit, OnChanges {
  @Input() type: 'create' | 'edit' = 'create';
  @Input() dataForm: LeaveRequest = {};

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter<boolean>();
  @Input() canChooseEmployee: boolean = true;
  @Output() recallData = new EventEmitter();

  isVisiblePopListEmployee: boolean = false;
  listEmployee: EmployeeRecord[] = [];
  leaveTypes: LeaveBalance[] = [];
  dataInput: LeaveRequest = {};
  currentEmployeeCode: string = '';
  employeeLeaveBalance: LeaveBalance[] = [];

  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private leaveService: ManageLeaveService,
    private settingService: ManageSettingService,
    private userAccountService: UserAccountService,
  ) {}
  ngOnInit(): void {
    this.getListEmployee();
    this.getLeaveTypes();
    this.getUserEmployeeCode();
    this.initializeData();

    // Default behavior: disable employee selection in edit mode
    if (this.type === 'edit') {
      this.canChooseEmployee = false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataForm'] && this.isvisible) {
      this.initializeData();
    }

    // If we're editing and canChooseEmployee isn't explicitly set, disable it
    if (this.type === 'edit' && !changes['canChooseEmployee']) {
      this.canChooseEmployee = false;
    }
  }

  private getUserEmployeeCode(): void {
    this.userAccountService.getCurrentEmployeeCodeInAccount().subscribe((code) => {
      this.currentEmployeeCode = code;
      if (this.type === 'create') {
        this.dataInput.employee_code = code;
        this.getEmployeeLeaveBalance();
      }
    });
  }

  private getEmployeeLeaveBalance(): void {
    if (this.dataInput.employee_code) {
      this.leaveService.getLeaveBalance(this.dataInput.employee_code).subscribe({
        next: (res) => {
          this.employeeLeaveBalance = res.data || [];
          this.employeeLeaveBalance = this.employeeLeaveBalance.filter(
            (item) => item.remaining_days !== undefined && item.remaining_days > 0,
          );
        },
        error: (error) => {
          this.message.error(error.message || 'Error fetching leave balance');
        },
      });
    }
  }

  private initializeData(): void {
    if (this.type === 'edit' && this.dataForm) {
      this.dataInput = { ...this.dataForm };

      // Convert string dates to Date objects for date pickers
      if (this.dataInput.start_date) {
        this.dataInput.start_date = new Date(this.dataInput.start_date);
      }

      if (this.dataInput.end_date) {
        this.dataInput.end_date = new Date(this.dataInput.end_date);
      }

      // If editing someone else's record, get their leave balance
      if (this.dataInput.employee_code !== this.currentEmployeeCode) {
        this.getEmployeeLeaveBalance();
      }
    } else {
      // Initialize with current employee data for create
      this.dataInput = {
        leave_type_id: this.dataForm.leave_type_id || -1,
        employee_code: this.currentEmployeeCode,
        status: ApprovalStatus.DANGCHO,
      };
    }
  }

  getListEmployee() {
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      filter: {},
    };
    this.employeeService.getListEmployees(request).subscribe({
      next: (res) => {
        this.listEmployee = res.data;
      },
      error: (err) => {
        this.message.error(err.error.result.message || 'Error fetching employees');
      },
    });
  }

  getLeaveTypes() {
    this.settingService.getLeaveType().subscribe({
      next: (res) => {
        this.leaveTypes = res.data || [];
      },
      error: (err) => {
        this.message.error(err.error.result.message || 'Error fetching leave types');
      },
    });
  }

  handleCancel() {
    this.dataInput = {};
    this.isvisible = false;
    this.isvisibleChange.emit(this.isvisible);
  }

  handleOk() {
    if (!this.validateForm()) {
      return;
    }

    // Prepare the request data
    const requestBody: LeaveRequest = { ...this.dataInput };

    if (this.type === 'create') {
      requestBody.status = ApprovalStatus.DANGCHO;
      this.leaveService.createLeaveRequest(requestBody).subscribe({
        next: (response) => {
          this.message.success('Tạo yêu cầu nghỉ phép thành công');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Có lỗi xảy ra khi tạo yêu cầu');
        },
      });
    } else {
      this.leaveService.updateLeaveRequest(String(this.dataForm.id), requestBody).subscribe({
        next: (response) => {
          this.message.success('Cập nhật yêu cầu nghỉ phép thành công');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Có lỗi xảy ra khi cập nhật yêu cầu');
        },
      });
    }
  }
  validateForm(): boolean {
    if (!this.dataInput.employee_code) {
      this.message.error('Vui lòng chọn nhân viên');
      return false;
    }

    if (!this.dataInput.leave_type_id) {
      this.message.error('Vui lòng chọn loại nghỉ phép');
      return false;
    }

    if (!this.dataInput.start_date) {
      this.message.error('Vui lòng chọn ngày bắt đầu');
      return false;
    }

    if (!this.dataInput.end_date) {
      this.message.error('Vui lòng chọn ngày kết thúc');
      return false;
    }

    if (new Date(this.dataInput.start_date) > new Date(this.dataInput.end_date)) {
      this.message.error('Ngày bắt đầu phải trước ngày kết thúc');
      return false;
    }

    // Kiểm tra số ngày nghỉ phép có vượt quá số ngày còn lại không
    if (this.dataInput.leave_type_id) {
      // Tạo bản sao của các ngày để tránh thay đổi dữ liệu gốc
      const startDate = new Date(this.dataInput.start_date);
      const endDate = new Date(this.dataInput.end_date);

      // Reset giờ, phút, giây và mili giây để đảm bảo so sánh chỉ dựa trên ngày
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Tính số ngày nghỉ (bao gồm cả ngày bắt đầu và ngày kết thúc)
      const oneDayMs = 24 * 60 * 60 * 1000; // Số mili giây trong một ngày
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = Math.round(diffMs / oneDayMs) + 1; // +1 để tính cả ngày bắt đầu

      // Tìm số ngày còn lại của loại nghỉ phép đã chọn
      const selectedLeaveType = this.employeeLeaveBalance.find(
        (lt) => lt.leave_type_id === this.dataInput.leave_type_id,
      );

      if (selectedLeaveType && selectedLeaveType.remaining_days !== undefined) {
        if (diffDays > selectedLeaveType.remaining_days) {
          this.message.error(
            `Số ngày nghỉ (${diffDays} ngày) vượt quá số ngày nghỉ phép còn lại (${selectedLeaveType.remaining_days} ngày)`,
          );
          return false;
        }
      }
    }

    if (!this.dataInput.reason) {
      this.message.error('Vui lòng nhập lý do nghỉ phép');
      return false;
    }

    return true;
  }

  chooseEmployee(employee: any) {
    if (employee) {
      this.dataInput.employee_code = employee.employee_code;
      this.isVisiblePopListEmployee = false;
      this.message.success(`Đã chọn nhân viên: ${employee.employee_code}`);
      // Get leave balance for the selected employee
      this.getEmployeeLeaveBalance();
    }
  }

  onLeaveTypeChange(): void {
    // Find selected leave type details
    const selectedLeaveType = this.employeeLeaveBalance.find(
      (lt) => lt.leave_type_id === this.dataInput.leave_type_id,
    );

    if (selectedLeaveType) {
      this.dataInput.leave_type_name = selectedLeaveType.leave_type_name;
      this.dataInput.is_paid = selectedLeaveType.is_paid;
    }
  }
}
