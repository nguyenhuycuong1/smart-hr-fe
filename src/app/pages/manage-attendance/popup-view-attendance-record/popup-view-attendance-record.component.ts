import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ApprovalStatus,
  AttendanceAdjustment,
  AttendanceRecord,
  AttendanceStatus,
} from '../../../shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageAttendanceService } from '../manage-attendance.service';

@Component({
  selector: 'app-popup-view-attendance-record',
  standalone: false,
  templateUrl: './popup-view-attendance-record.component.html',
  styleUrl: './popup-view-attendance-record.component.scss',
})
export class PopupViewAttendanceRecordComponent implements OnInit {
  @Input() attendanceId: number | null = null;
  @Input() attendanceRecord: AttendanceRecord = {};
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
  handleOk(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  attendanceAdjustment: AttendanceAdjustment = {};
  isvisiblePopupCreateAttendance: boolean = false;
  showPopupCreateAttendanceAdjustment(): void {
    this.isvisiblePopupCreateAttendance = true;
    this.attendanceAdjustment = {
      ...this.attendanceRecord,
      status: ApprovalStatus.DANGCHO,
      original_check_in: this.attendanceRecord.check_in_time,
      original_check_out: this.attendanceRecord.check_out_time,
    };
  }

  protected readonly ATTENDANCE_STATUS = AttendanceStatus;
}
