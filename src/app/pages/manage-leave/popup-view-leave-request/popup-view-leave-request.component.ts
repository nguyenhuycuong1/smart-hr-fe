import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApprovalStatus, LeaveRequest } from '../../../shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageLeaveService } from '../manage-leave.service';
import { UserAccountService } from '../../../services/user-account/user-account.service';

@Component({
  selector: 'app-popup-view-leave-request',
  standalone: false,
  templateUrl: './popup-view-leave-request.component.html',
  styleUrl: './popup-view-leave-request.component.scss',
})
export class PopupViewLeaveRequestComponent implements OnInit {
  @Input() leaveRequestId: number | null = null;
  @Input() leaveRequest: LeaveRequest = {};
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() recallData = new EventEmitter<void>();

  isLoading: boolean = false;
  fullNameCurrentUser: string = '';

  constructor(
    private message: NzMessageService,
    private manageLeaveService: ManageLeaveService,
    private userAccountService: UserAccountService,
  ) {}

  ngOnInit(): void {
    this.userAccountService.getFullNameCurrentUser().then((fullName) => {
      this.fullNameCurrentUser = fullName;
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleOk(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  approveLeaveRequest(): void {
    if (!this.leaveRequest.id) {
      this.message.error('Không tìm thấy ID yêu cầu nghỉ phép');
      return;
    }

    this.isLoading = true;
    this.manageLeaveService
      .approveLeaveRequest(this.leaveRequest.id, this.fullNameCurrentUser)
      .subscribe({
        next: (res) => {
          this.message.success('Phê duyệt yêu cầu nghỉ phép thành công');
          this.isVisible = false;
          this.isVisibleChange.emit(this.isVisible);
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu nghỉ phép');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  rejectLeaveRequest(): void {
    if (!this.leaveRequest.id) {
      this.message.error('Không tìm thấy ID yêu cầu nghỉ phép');
      return;
    }

    this.isLoading = true;
    this.manageLeaveService
      .rejectLeaveRequest(this.leaveRequest.id, this.fullNameCurrentUser)
      .subscribe({
        next: (res) => {
          this.message.success('Từ chối yêu cầu nghỉ phép thành công');
          this.isVisible = false;
          this.isVisibleChange.emit(this.isVisible);
          this.recallData.emit();
        },
        error: (error) => {
          this.message.error(error.message || 'Có lỗi xảy ra khi từ chối yêu cầu nghỉ phép');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  protected readonly APPROVAL_STATUS = ApprovalStatus;
}
