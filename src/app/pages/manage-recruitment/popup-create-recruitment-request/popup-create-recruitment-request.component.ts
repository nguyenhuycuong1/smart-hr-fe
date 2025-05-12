import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RecruitmentRequest, RecruitmentRequestStatus } from '../../../shared/models';
import { KeycloakService } from 'keycloak-angular';
import { ManageRecruitmentService } from '../manage-recruitment.service';

@Component({
  selector: 'app-popup-create-recruitment-request',
  standalone: false,
  templateUrl: './popup-create-recruitment-request.component.html',
  styleUrl: './popup-create-recruitment-request.component.scss',
})
export class PopupCreateRecruitmentRequestComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() recallData = new EventEmitter<any>();

  constructor(
    private message: NzMessageService,
    private keycloak: KeycloakService,
    private manageRecruitmentService: ManageRecruitmentService,
  ) {}

  ngOnInit() {}

  handleCreate() {
    this.formData.username_created = this.keycloak.getUsername();
    this.keycloak
      .loadUserProfile()
      .then((profile) => {
        this.formData.created_by = profile.lastName + ' ' + profile.firstName;
      })
      .then(() => {
        this.manageRecruitmentService.createRecruitmentRequest(this.formData).subscribe({
          next: (res) => {
            this.message.success('Thành công!');
            this.handleCancel();
            this.recallData.emit(true);
          },
          error: (err) => {
            this.message.error(err.error.result.message);
          },
        });
      });
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    this.formData = {
      department_code: '',
      job_code: '',
      quantity: 1,
      status: RecruitmentRequestStatus.KHOITAO,
      created_at: new Date(),
      created_by: 'admin',
    };
  }

  formData: RecruitmentRequest = {
    department_code: '',
    job_code: '',
    quantity: 1,
    status: RecruitmentRequestStatus.KHOITAO,
    created_at: new Date(),
    created_by: 'admin',
    username_created: 'admin',
  };
}
