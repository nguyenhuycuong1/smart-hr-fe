import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { JobPost } from '../../../shared/models';

@Component({
  selector: 'app-popup-edit-job-post',
  standalone: false,
  templateUrl: './popup-edit-job-post.component.html',
  styleUrl: './popup-edit-job-post.component.scss',
})
export class PopupEditJobPostComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() formData: any = {};
  @Output() recallData = new EventEmitter<any>();
  @Input() title: string = 'Tạo mới';
  @Input() textConfirm: string = 'Lưu';

  @Input() requestCode: string = '';
  @Input() typeHandle: 'create' | 'update' | '' = 'create';
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

  ngOnInit() {}

  ngOnChanges() {
    if (Object.keys(this.formData).length !== 0) {
      this.dataInput = {
        title: 'Tuyển dụng ' + (this.formData.job_position?.job_name || ''),
        request_code: this.formData.recruitment_request_code,
        description: '',
        created_at: new Date(),
      };
      this.typeHandle = 'create';
    } else {
      this.getJobPostByRequestCode();
      this.typeHandle = 'update';
    }
  }

  getJobPostByRequestCode() {
    this.recruitmentRequestService.getJobPostByResquestCode(this.requestCode).subscribe({
      next: (res) => {
        this.dataInput = res.data.jobPost;
        this.formData = res.data.recruitmentRequest;
      },
      error: (err) => {
        this.message.error(err.error.result.message);
      },
    });
  }

  handleCreate() {
    if (this.typeHandle == 'create') {
      this.recruitmentRequestService.createJobPost(this.dataInput).subscribe({
        next: (res) => {
          this.message.success('Đăng bài tuyển dụng thành công!');
          this.recallData.emit();
          this.handleCancel();
        },
        error: (err) => {
          this.message.error(err.error.result.message);
        },
      });
    } else {
      this.recruitmentRequestService.updateJobPost(this.dataInput).subscribe({
        next: (res) => {
          this.message.success('Cập nhật bài tuyển dụng thành công!');
          this.recallData.emit();
          this.handleCancel();
        },
        error: (err) => {
          this.message.error(err.error.result.message);
        },
      });
    }
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
