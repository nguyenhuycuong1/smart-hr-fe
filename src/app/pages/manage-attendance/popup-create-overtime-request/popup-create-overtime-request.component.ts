import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApprovalStatus, OvertimeRequest, PageFilterRequest } from '../../../shared/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { EmployeeService } from '../../../services/employees/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageAttendanceService } from '../manage-attendance.service';
import { TimeService } from '../../../services/time-service/time-service.service';

@Component({
  selector: 'app-popup-create-overtime-request',
  standalone: false,
  templateUrl: './popup-create-overtime-request.component.html',
  styleUrl: './popup-create-overtime-request.component.scss',
})
export class PopupCreateOvertimeRequestComponent implements OnInit, OnChanges {
  @Input() type: 'create' | 'edit' = 'create';
  @Input() dataForm: OvertimeRequest = {};
  @Input() employeeCode: string = '';
  @Input() fromPersonalData: boolean = false;

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter();
  @Output() recallData = new EventEmitter();

  // Thêm các thuộc tính mới
  isVisiblePopListEmployee: boolean = false;
  listEmployee: any[] = [];

  dataInput: OvertimeRequest = {};
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
    if (this.dataInput.start_time) {
      this.dataInput.start_time = this.timeService.parseTimeStringToDate(this.dataInput.start_time);
    }
    if (this.dataInput.end_time) {
      this.dataInput.end_time = this.timeService.parseTimeStringToDate(this.dataInput.end_time);
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
    const requestBody: OvertimeRequest = {
      ...this.dataInput,
      start_time: this.timeService.formatTimeToLocalTime(this.dataInput.start_time),
      end_time: this.timeService.formatTimeToLocalTime(this.dataInput.end_time),
    };

    console.log('Sending data to server:', requestBody);

    // Nếu là create thì gọi API tạo mới, nếu là edit thì gọi API cập nhật
    if (this.type === 'create') {
      requestBody.status = ApprovalStatus.DANGCHO;
      this.attendanceService.createOvertimeRequest(requestBody).subscribe({
        next: (response) => {
          this.message.success('Tạo yêu cầu làm thêm giờ thành công');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Có lỗi xảy ra khi tạo yêu cầu');
        },
      });
    } else {
      this.attendanceService.updateOvertimeRequest(this.dataForm.id || -1, requestBody).subscribe({
        next: (response) => {
          this.message.success('Cập nhật yêu cầu làm thêm giờ thành công');
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
