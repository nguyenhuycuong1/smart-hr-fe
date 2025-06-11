import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApprovalStatus, AttendanceAdjustment, PageFilterRequest } from '../../../shared/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { EmployeeService } from '../../../services/employees/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageAttendanceService } from '../manage-attendance.service';
import { TimeService } from '../../../services/time-service/time-service.service';

@Component({
  selector: 'app-popup-create-attendance-adjustment',
  standalone: false,
  templateUrl: './popup-create-attendance-adjustment.component.html',
  styleUrl: './popup-create-attendance-adjustment.component.scss',
})
export class PopupCreateAttendanceAdjustmentComponent implements OnInit, OnChanges {
  @Input() type: 'create' | 'edit' = 'create';
  @Input() dataForm: AttendanceAdjustment = {};

  @Input() employeeCode: string = '';
  @Input() fromPersonalData: boolean = false;

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter();
  @Output() recallData = new EventEmitter();

  // Thêm các thuộc tính mới
  isVisiblePopListEmployee: boolean = false;
  listEmployee: any[] = [];

  dataInput: AttendanceAdjustment = {};
  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private attendanceService: ManageAttendanceService,
    private timeService: TimeService,
  ) {}

  ngOnInit(): void {
    if (this.fromPersonalData == false) {
      this.getListEmployee();
    }
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
    if (this.dataInput.adjusted_check_in) {
      this.dataInput.adjusted_check_in = this.timeService.parseTimeStringToDate(
        this.dataInput.adjusted_check_in,
      );
    }
    if (this.dataInput.adjusted_check_out) {
      this.dataInput.adjusted_check_out = this.timeService.parseTimeStringToDate(
        this.dataInput.adjusted_check_out,
      );
    }
    if (this.dataInput.original_check_in) {
      this.dataInput.original_check_in = this.timeService.parseTimeStringToDate(
        this.dataInput.original_check_in,
      );
    }
    if (this.dataInput.original_check_out) {
      this.dataInput.original_check_out = this.timeService.parseTimeStringToDate(
        this.dataInput.original_check_out,
      );
    }

    console.log('Data after conversion:', this.dataInput);
  }

  pageNumber: number = 1;
  pageSize: number = 8;
  totalEmployees: number = 0;

  getListEmployee() {
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: {
        is_active: true,
        employee_code: this.employeeCode,
      },
    };
    this.employeeService.getListEmployees(request).subscribe({
      next: (res) => {
        this.listEmployee = res.data;
        this.totalEmployees = res.dataCount || 0;
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
    const requestBody: AttendanceAdjustment = {
      ...this.dataInput,
      adjusted_check_in: this.timeService.formatTimeToLocalTime(this.dataInput.adjusted_check_in),
      adjusted_check_out: this.timeService.formatTimeToLocalTime(this.dataInput.adjusted_check_out),
      original_check_in: this.timeService.formatTimeToLocalTime(this.dataInput.original_check_in),
      original_check_out: this.timeService.formatTimeToLocalTime(this.dataInput.original_check_out),
    };

    console.log('Sending data to server:', requestBody);

    // Nếu là create thì gọi API tạo mới, nếu là edit thì gọi API cập nhật
    if (this.type === 'create') {
      requestBody.status = ApprovalStatus.DANGCHO;
      this.attendanceService.createAttendanceAdjustment(requestBody).subscribe({
        next: (response) => {
          this.message.success('Tạo yêu cầu điều chỉnh chấm công thành công');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Có lỗi xảy ra khi tạo yêu cầu');
        },
      });
    } else {
      this.attendanceService
        .updateAttendanceAdjustment(this.dataForm.id || -1, requestBody)
        .subscribe({
          next: (response) => {
            this.message.success('Cập nhật yêu cầu điều chỉnh chấm công thành công');
            this.handleCancel();
            this.recallData.emit();
          },
          error: (error) => {
            this.message.error(error.error.result.message || 'Có lỗi xảy ra khi cập nhật yêu cầu');
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
}
