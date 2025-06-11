import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AttendanceRecord, AttendanceStatus, PageFilterRequest } from '../../../shared/models';
import { EmployeeService } from '../../../services/employees/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageAttendanceService } from '../manage-attendance.service';
import { TimeService } from '../../../services/time-service/time-service.service';

@Component({
  selector: 'app-popup-create-attendance',
  standalone: false,
  templateUrl: './popup-create-attendance.component.html',
  styleUrl: './popup-create-attendance.component.scss',
})
export class PopupCreateAttendanceComponent implements OnInit, OnChanges {
  @Input() type: 'create' | 'edit' = 'create';
  @Input() dataForm: AttendanceRecord = {};

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter();
  @Output() recallData = new EventEmitter();

  // Thuộc tính
  isVisiblePopListEmployee: boolean = false;
  listEmployee: any[] = [];

  dataInput: AttendanceRecord = {};

  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private attendanceService: ManageAttendanceService,
    private timeService: TimeService,
  ) {}

  ngOnInit(): void {
    this.getListEmployee();
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Nếu dataForm thay đổi, cập nhật lại dataInput
    if (changes['dataForm'] && this.isvisible) {
      this.initializeData();
    }
  }

  private initializeData(): void {
    this.dataInput = { ...this.dataForm };

    // Chuyển đổi chuỗi thời gian thành đối tượng Date cho nz-time-picker
    if (this.dataInput.check_in_time) {
      this.dataInput.check_in_time = this.timeService.parseTimeStringToDate(
        this.dataInput.check_in_time,
      );
    }
    if (this.dataInput.check_out_time) {
      this.dataInput.check_out_time = this.timeService.parseTimeStringToDate(
        this.dataInput.check_out_time,
      );
    }

    console.log('Data after conversion:', this.dataInput);
  }

  totalEmployees: number = 0;
  pageNumber: number = 1;
  pageSize: number = 8;

  getListEmployee() {
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: {
        is_active: true,
      },
    };
    this.employeeService.getListEmployees(request).subscribe({
      next: (res) => {
        this.listEmployee = res.data;
        this.totalEmployees = res.dataCount || 0; // Cập nhật tổng số nhân viên
      },
      error: (err) => {
        this.message.error(err.error.result.message);
      },
    });
  }

  handleCancel() {
    this.dataInput = {};
    this.isvisible = false;
    this.isvisibleChange.emit(this.isvisible);
  }

  handleOk() {
    // Xử lý khi nhấn nút xác nhận
    const requestBody: AttendanceRecord = {
      ...this.dataInput,
      check_in_time: this.timeService.formatTimeToLocalTime(this.dataInput.check_in_time),
      check_out_time: this.timeService.formatTimeToLocalTime(this.dataInput.check_out_time),
    };

    // Nếu là create thì gọi API tạo mới, nếu là edit thì gọi API cập nhật
    if (this.type === 'create') {
      this.attendanceService.createAttendance(requestBody).subscribe({
        next: (response) => {
          this.message.success('Tạo chấm công thành công');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Có lỗi xảy ra khi tạo chấm công');
        },
      });
    } else {
      this.attendanceService.updateAttendance(this.dataForm.id || -1, requestBody).subscribe({
        next: (response) => {
          this.message.success('Cập nhật chấm công thành công');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Có lỗi xảy ra khi cập nhật chấm công');
        },
      });
    }
  }

  chooseEmployee(employee: any) {
    if (employee) {
      this.dataInput.employee_code = employee.employee_code;
      this.isVisiblePopListEmployee = false;
    }
  }

  disableFutureDate = (current: Date): boolean => {
    return current.getTime() > new Date().getTime();
  };

  protected readonly ATTENDANCE_STATUS = AttendanceStatus;
}
