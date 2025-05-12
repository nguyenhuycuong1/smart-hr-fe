import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecruitmentRequest, RecruitmentRequestRecord } from '../../../shared/models';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-popup-edit-recruitment-request',
  standalone: false,
  templateUrl: './popup-edit-recruitment-request.component.html',
  styleUrl: './popup-edit-recruitment-request.component.scss',
})
export class PopupEditRecruitmentRequestComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() typePopup: 'view' | 'edit' = 'edit';

  textConfirm: string = 'Lưu';
  title: string = 'Cập nhật yêu cầu tuyển dụng';

  @Input() formData: RecruitmentRequestRecord = {};
  @Output() recallData = new EventEmitter<void>();

  constructor(
    private manageRecruitmentService: ManageRecruitmentService,
    private message: NzMessageService,
    private keycloak: KeycloakService,
  ) {}

  ngOnChanges() {
    if (this.typePopup === 'view') {
      this.textConfirm = 'Xác nhận';
      this.title = 'Xem yêu cầu tuyển dụng';
    } else {
      this.textConfirm = 'Lưu';
      this.title = 'Cập nhật yêu cầu tuyển dụng';
    }
  }

  handleUpdate() {
    if (this.typePopup === 'edit') {
      this.manageRecruitmentService.updateRecruitmentRequest(this.formData).subscribe({
        next: (res) => {
          this.message.success('Thành công!');
          this.handleCancel();
          this.recallData.emit();
        },
        error: (err) => {
          console.log(err.error.result.message);
        },
      });
    } else {
      this.handleCancel();
    }
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
