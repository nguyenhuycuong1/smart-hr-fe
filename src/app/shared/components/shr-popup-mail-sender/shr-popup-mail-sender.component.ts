import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MailService } from '../../../services/mail-service/mail.service';
import { Employee, EmployeeRecord, PageFilterRequest, PageResponse } from '../../models';
import { MailTemplate } from '../../models/mailTeamplate.model';
import { MailSender } from '../../models/mailSender.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MailAccount } from '../../models/mailAccount.model';
import { Candidate } from '../../models/candidate.model';
import { UserAccountService } from '../../../services/user-account/user-account.service';
import { BaseService } from '../../../services/app-service/base.service';
import { TemplateService } from '../../../services/common-service/template.service';

@Component({
  selector: 'shr-popup-mail-sender',
  standalone: false,
  templateUrl: './shr-popup-mail-sender.component.html',
  styleUrl: './shr-popup-mail-sender.component.scss',
})
export class ShrPopupMailSenderComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Input() width: string = '1000px';
  @Output() recallData = new EventEmitter<any>();

  @Input() data: EmployeeRecord | Employee | Candidate = {}; // Data to be sent via email

  @Input() sendingObject: string = ''; // Subject of the email

  @Input() dataInput: MailSender = {}; // Input data for the mail sender

  listMailTemplates: MailTemplate[] = []; // List of mail templates
  currentMailTemplate: MailTemplate = {};

  listMailAccounts: MailAccount[] = []; // List of mail accounts

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

  listSelectedCc: string[] = []; // List of selected CC recipients
  listSelectedBcc: string[] = []; // List of selected BCC recipients

  listCc: string[] = []; // List of CC recipients
  listBcc: string[] = []; // List of BCC recipients

  currentWorkEmailUserLogin: string = ''; // Current user information

  infoBusiness: any = {}; // Business information
  constructor(
    private mailService: MailService,
    private message: NzMessageService,
    private userAccount: UserAccountService,
    private baseService: BaseService,
    private templateService: TemplateService,
  ) {
    this.userAccount.getCurrentUserAccount().subscribe((res) => {
      this.currentWorkEmailUserLogin = res.data?.attributes?.workEmail[0] || '';
      this.getMailAccountByUserLogin(this.currentWorkEmailUserLogin);
    });
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.getMailTemplate();
    this.getMailAccount();
    this.getInfoBusiness();
    this.initDataInput();
  }

  initDataInput(): void {
    this.dataInput = {
      to: this.data.email || '',
    };
  }

  getInfoBusiness() {
    this.baseService.getInfoBusiness().subscribe((res) => {
      this.infoBusiness = res.data;
      this.listSelectedCc = [this.infoBusiness.business_email];
    });
  }

  getMailAccountByUserLogin(username: string) {
    this.mailService.getMailAccountByUserLogin(username).subscribe({
      next: (response) => {
        if (response.data) {
          this.dataInput.mail_account_id = response.data.id;
        } else {
          this.message.warning('Tài khoản này chưa được cấu hình email để thực hiện chức năng');
        }
      },
      error: (error) => {
        // this.message.error(error.error.result.message || 'Failed to fetch mail account');
      },
    });
  }

  getMailTemplate(): void {
    if (this.sendingObject) {
      const request: PageFilterRequest<MailTemplate> = {
        pageNumber: 0,
        pageSize: 0,
        sortOrder: 'ASC',
        sortProperty: 'id',
        filter: {
          sending_object: this.sendingObject,
        },
      };
      this.mailService.searchMailTemplates(request).subscribe({
        next: (response: PageResponse<MailTemplate[]>) => {
          this.listMailTemplates = response.data || [];
          this.currentMailTemplate = this.listMailTemplates[0] || {};
          this.selectTemplate(this.currentMailTemplate);
        },
        error: (error) => {
          this.message.error(error.error.result.message || 'Failed to fetch mail templates');
        },
      });
    }
  }

  getMailAccount() {
    const request: PageFilterRequest<MailAccount> = {
      pageNumber: 0,
      pageSize: 0,
      sortOrder: 'ASC',
      sortProperty: 'id',
      filter: {},
    };
    this.mailService.searchMailAccounts(request).subscribe({
      next: (response) => {
        this.listMailAccounts = response.data || [];
      },
      error: (error) => {
        this.message.error(error.error.result.message || 'Failed to fetch mail accounts');
      },
    });
  }
  selectTemplate(template: MailTemplate): void {
    if (!template || !template.id) {
      return;
    }

    this.currentMailTemplate = template;
    this.dataInput.mail_template_id = template.id;

    // Kiểm tra xem dữ liệu đầu vào có đúng cấu trúc không
    const flattenedData = this.templateService.completelyFlattenObject(this.data);

    // Xử lý tiêu đề với dữ liệu đã dải phẳng hoàn toàn
    const originalSubject = template.subject_template || '';
    this.dataInput.subject = this.templateService.processSimplifiedCandidateTemplate(
      originalSubject,
      this.data,
    );

    // Xử lý nội dung với dữ liệu đã dải phẳng hoàn toàn
    const content = template.content_template || ''; // Xử lý nội dung và áp dụng placeholder
    this.dataInput.content = this.processHtmlContent(content, this.data);
  }

  /**
   * Xử lý nội dung HTML để thay thế placeholder
   * @param htmlContent Nội dung HTML
   * @param data Dữ liệu để thay thế
   * @returns Nội dung HTML đã được xử lý
   */
  processHtmlContent(htmlContent: string, data: Record<string, any>): string {
    if (!htmlContent || !data) {
      return htmlContent || '';
    }

    try {
      // Sử dụng phương thức xử lý HTML chuyên dụng từ service
      const processedContent = this.templateService.processHtmlContent(htmlContent, data);

      // Log để debug

      return processedContent;
    } catch (error) {
      return htmlContent;
    }
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCcAndBcc() {
    this.dataInput.cc = this.listSelectedCc.join(', ');
    this.dataInput.bcc = this.listSelectedBcc.join(', ');

    // Cập nhật danh sách CC và BCC
    this.listCc = this.listSelectedCc;
    this.listBcc = this.listSelectedBcc;

    // Reset danh sách đã chọn
    this.listSelectedCc = [];
    this.listSelectedBcc = [];
  }

  isLoading: boolean = false;
  sendMail() {
    this.isLoading = true;
    this.handleCcAndBcc();
    this.mailService.sendMail(this.dataInput).subscribe({
      next: (response) => {
        this.message.success('Gửi email thành công!');
        this.handleCancel();
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error(error.error.result.message || 'Gửi email thất bại');
        this.isLoading = false;
      },
    });
  }
}
