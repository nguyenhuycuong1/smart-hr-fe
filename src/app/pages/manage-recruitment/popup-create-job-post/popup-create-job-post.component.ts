import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobPost, PageFilterRequest, RecruitmentRequestStatus } from '../../../shared/models';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-popup-create-job-post',
  standalone: false,
  templateUrl: './popup-create-job-post.component.html',
  styleUrl: './popup-create-job-post.component.scss',
})
export class PopupCreateJobPostComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() formData: any = {};
  @Output() recallData = new EventEmitter<any>();
  @Input() title: string = 'Tạo mới';
  @Input() textConfirm: string = 'Lưu';

  @Input() requestCode: string = '';

  dataInput: JobPost = {
    title: ' ',
    job_post_code: '',
    request_code: '',
    description: '',
  };

  config = {
    placeholder: 'Nhập mô tả công việc...',
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
    private recruitmentRequestService: ManageRecruitmentService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getListRequestCode();
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  chooseRequestCode(event: any) {
    if (event) {
      console.log(event);
      this.dataInput.request_code = event.recruitment_request_code;
      this.dataInput.title = 'Tuyển dụng ' + event.job_position.job_name;
      this.formData.quantity = event.quantity;
      this.formData.department_name = event.department.department_name;
      this.formData.job_name = event.job_position.job_name;
      this.formData.created_by = event.created_by;
      this.dataInput.created_at = new Date();
      this.isvisiblePopupListEmployee = false;
    }
  }
  getListRequestCode() {
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 100,
      sortOrder: 'DESC',
      sortProperty: 'createdAt',
      filter: {
        status: RecruitmentRequestStatus.PHEDUYET,
      },
    };
    this.recruitmentRequestService.searchRecruitmentRequest(request).subscribe((res) => {
      if (res) {
        this.listRequestCode = res.data || [];
      }
    });
  }

  handleCreate() {
    this.recruitmentRequestService.createJobPost(this.dataInput).subscribe({
      next: (res) => {
        this.isVisible = false;
        this.recallData.emit(res.data);
        this.message.success('Tạo mới thành công');
        this.handleCancel();
      },
      error: (err) => {
        console.error(err);
        this.message.error(err.error.result.message || 'Có lỗi xảy ra, vui lòng thử lại sau!');
      },
      complete: () => {},
    });
  }

  isvisiblePopupListEmployee: boolean = false;
  listRequestCode: any[] = [];

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
  protected readonly RecruitmentRequestStatus = RecruitmentRequestStatus;
}
