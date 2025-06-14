import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentsModule } from '../../../shared/components/components.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageSettingService } from '../manage-setting.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { MailTemplate } from '../../../shared/models/mailTeamplate.model';
import { NgxSummernoteModule } from 'ngx-summernote';
import { TemplateService } from '../../../services/common-service/template.service';
import { Employee, EmployeeRecord } from '../../../shared/models/employee.model';
import { Candidate, CandidateStatus } from '../../../shared/models/candidate.model';

@Component({
  selector: 'app-mail-template-setting',
  standalone: true,
  templateUrl: './mail-template-setting.component.html',
  styleUrls: ['./mail-template-setting.component.scss'],
  imports: [
    CommonModule,
    ComponentsModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    NzFormModule,
    FormsModule,
    NzSpinModule,
    NzSelectModule,
    NgxSummernoteModule,
    NzCollapseModule,
  ],
})
export class MailTemplateSettingComponent {
  breadcrumbs = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Mẫu email', link: '/manage-setting/mail-template-setting' },
  ];

  listMailTemplates: MailTemplate[] = [];

  config = {
    placeholder: 'Nhập nội dung email...',
    tabsize: 2,
    height: 300,
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      [
        'font',
        ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear'],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'hr']],
    ],
    fontNames: [
      'Helvetica',
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'Courier New',
      'Roboto',
      'Times',
    ],
  };

  constructor(
    private settingService: ManageSettingService,
    private store: Store<AppState>,
    private templateService: TemplateService,
    private message: NzMessageService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.getListMailTemplates();
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  getListMailTemplates() {
    this.settingService.getMailTemplates().subscribe({
      next: (response) => {
        this.listMailTemplates = response.data || [];
      },
      error: (error) => {
        console.error('Error fetching mail templates:', error);
      },
    });
  }

  dataInput: MailTemplate = {};
  isPopupCreateMailTemplateVisible: boolean = false;
  showPopupCreateMailTemplate() {
    this.isPopupCreateMailTemplateVisible = true;
  }

  handleCreateMailTemplate() {
    this.settingService.createMailTemplate(this.dataInput).subscribe({
      next: (response) => {
        this.isPopupCreateMailTemplateVisible = false;
        this.getListMailTemplates();
        this.dataInput = {};
        this.message.success('Tạo mẫu email thành công!');
      },
      error: (error) => {
        this.message.error(error.error.result.message || 'Tạo mẫu email thất bại!');
      },
    });
  }

  isPopupEditMailTemplateVisible: boolean = false;
  currentMailTemplate: MailTemplate = {};
  showPopupEditMailTemplate(mailTemplate: MailTemplate) {
    this.currentMailTemplate = { ...mailTemplate };
    this.isPopupEditMailTemplateVisible = true;
  }

  handleEditMailTemplate() {
    this.settingService.updateMailTemplate(this.currentMailTemplate).subscribe({
      next: (response) => {
        this.isPopupEditMailTemplateVisible = false;
        this.getListMailTemplates();
        this.currentMailTemplate = {};
        this.message.success('Cập nhật mẫu email thành công!');
      },
      error: (error) => {
        this.message.error(error.error.result.message || 'Cập nhật mẫu email thất bại!');
      },
    });
  }

  isPopupDeleteMailTemplateVisible: boolean = false;
  currentMailTemplateToDelete: MailTemplate = {};
  showPopupDeleteMailTemplate(mailTemplate: MailTemplate) {
    this.currentMailTemplateToDelete = { ...mailTemplate };
    this.isPopupDeleteMailTemplateVisible = true;
  }

  handleDeleteMailTemplate() {
    this.settingService.deleteMailTemplate(this.currentMailTemplateToDelete.id || -1).subscribe({
      next: (response) => {
        this.isPopupDeleteMailTemplateVisible = false;
        this.getListMailTemplates();
        this.currentMailTemplateToDelete = {};
      },
      error: (error) => {
        console.error('Error deleting mail template:', error);
      },
    });
  }

  // Dummy data objects for placeholder demonstration
  employeeDemoData: EmployeeRecord = {
    id: 1,
    employee_code: 'EMP001',
    first_name: 'Nguyễn',
    last_name: 'Văn A',
    dob: '1990-01-01',
    hire_date: '2020-01-01',
    gender: 'Nam',
    phone_number: '0123456789',
    email: 'nguyenvana@example.com',
    address: 'Hà Nội, Việt Nam',
    current_address: 'Hà Nội, Việt Nam',
    employee_type: 'Chính thức',
    department: {
      id: 1,
      department_name: 'Phòng IT',
      department_code: 'IT',
    },
    team: {
      id: 1,
      team_name: 'Team Backend',
      team_code: 'BE',
    },
    jobPosition: {
      id: 1,
      job_name: 'Lập trình viên Backend',
      job_code: 'BE',
    },
    contractActive: {
      id: 1,
      contract_code: 'HD001',
      contract_type: 'Chính thức',
      start_date: '2020-01-01',
      end_date: '2025-01-01',
    },
  };

  candidateDemoData: Candidate = {
    id: 1,
    candidate_code: 'CV001',
    job_post_code: 'JP001',
    job_name: 'Lập trình viên Frontend',
    first_name: 'Trần',
    last_name: 'Thị B',
    email: 'tranthib@example.com',
    phone_number: '0987654321',
    resume_url: 'https://example.com/resume.pdf',
    status: CandidateStatus.DANGUNGTUYEN,
    applied_at: new Date(),
    gender: 'Nữ',
    address: 'Hồ Chí Minh, Việt Nam',
    current_address: 'Hồ Chí Minh, Việt Nam',
    dob: new Date('1992-05-10'),
    job_position: {
      id: 2,
      job_name: 'Lập trình viên Frontend',
      job_code: 'FE',
    },
  };

  /**
   * Lấy danh sách các key có thể sử dụng trong template dựa trên đối tượng gửi
   * @param sendingObject Đối tượng gửi (employee/candidate)
   * @returns Mảng các key có thể sử dụng
   */
  getAvailablePlaceholders(sendingObject: string): string[] {
    if (sendingObject === 'employee') {
      return this.templateService.getSimplifiedCandidateKeys(this.employeeDemoData);
    } else if (sendingObject === 'candidate') {
      return this.templateService.getSimplifiedCandidateKeys(this.candidateDemoData);
    }
    return [];
  }

  /**
   * Lấy thông tin chi tiết về đường dẫn của các key
   * @param sendingObject Đối tượng gửi (employee/candidate)
   * @returns Object chứa thông tin về đường dẫn của các key
   */
  getKeyMappings(sendingObject: string): Record<string, string[]> {
    if (sendingObject === 'employee') {
      return this.templateService.getKeyMappings(this.employeeDemoData);
    } else if (sendingObject === 'candidate') {
      return this.templateService.getKeyMappings(this.candidateDemoData);
    }
    return {};
  }

  /**
   * Sao chép placeholder vào clipboard
   * @param key Key cần sao chép
   */
  copyPlaceholder(key: string): void {
    const placeholder = `{{${key}}}`;

    // Tạo một textarea tạm thời để thực hiện sao chép
    const textArea = document.createElement('textarea');
    textArea.value = placeholder;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      // Thực hiện sao chép
      document.execCommand('copy');
      this.message.success(`Đã sao chép "${placeholder}" vào clipboard`);
    } catch (err) {
      this.message.error('Không thể sao chép, vui lòng thử lại');
    }

    // Dọn dẹp
    document.body.removeChild(textArea);
  }
}
