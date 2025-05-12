import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Candidate, CandidateStatus } from '../../../shared/models/candidate.model';
import {
  Employee,
  EmployeeRecord,
  InterviewSchedule,
  JobPost,
  PageFilterRequest,
} from '../../../shared/models';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { EmployeeService } from '../../../services/employees/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseService } from '../../../services/app-service/base.service';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';

@Component({
  selector: 'app-popup-update-interview-session',
  standalone: false,
  templateUrl: './popup-update-interview-session.component.html',
  styleUrl: './popup-update-interview-session.component.scss',
})
export class PopupUpdateInterviewSessionComponent {
  @Input() data: InterviewSchedule = {};
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() width: string = '1000px';
  @Output() recallData = new EventEmitter<any>();

  dataForm: InterviewSchedule = {};

  constructor(
    private manageRecruitment: ManageRecruitmentService,
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private baseService: BaseService,
  ) {}

  ngOnInit(): void {
    this.getListCandidate();
    this.getListJobPost();
    this.getListRecruiter();
  }

  ngOnChanges() {
    if (this.data) {
      console.log(this.data);
      this.dataForm = { ...this.data };
      this.listCandidateChoosed = this.dataForm.candidate_codes || [];
      this.candidateCodes = this.listCandidateChoosed.join(', ');
      this.listRecruiterChoosed = this.dataForm.recruiter_codes || [];
      this.recruiterCodes = this.listRecruiterChoosed.join(', ');
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  getListCandidate() {
    const request: PageFilterRequest<Candidate> = {
      pageNumber: 0,
      pageSize: 0,
      sortOrder: 'ASC',
      sortProperty: 'id',
      filter: {
        status: CandidateStatus.DANGUNGTUYEN,
        job_post_code: this.dataForm.job_post_code,
      },
    };
    this.manageRecruitment.searchCandidate(request).subscribe({
      next: (res) => {
        this.listCandidate = res.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getListJobPost() {
    const request: PageFilterRequest<JobPost> = {
      pageNumber: 0,
      pageSize: 0,
      sortOrder: 'ASC',
      sortProperty: 'id',
      filter: {
        is_open: true,
      },
    };
    this.manageRecruitment.searchJobPost(request).subscribe({
      next: (res) => {
        this.listJobPost = res.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getListRecruiter() {
    const request: PageFilterRequest<Employee> = {
      pageNumber: 0,
      pageSize: 0,
      sortOrder: 'ASC',
      sortProperty: 'id',
      filter: {},
    };
    this.employeeService.getListEmployees(request).subscribe({
      next: (res) => {
        this.listRecruiter = res.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  chooseJobPost(item: JobPost) {
    this.dataForm.job_post_code = item.job_post_code;
    this.getListCandidate();
    this.isVisiblePopListJobPost = false;
  }

  chooseCandidate(item: Candidate) {
    if (item.candidate_code) {
      if (this.listCandidateChoosed.includes(item.candidate_code)) {
        this.message.info('Ứng viên đã được chọn!');
        return;
      }
      this.listCandidateChoosed.push(item.candidate_code);
      this.candidateCodes = this.listCandidateChoosed.join(', ');
      console.log(this.listCandidateChoosed);
      this.isVisiblePopListCandidate = false;
    }
  }

  handleDeleteChosenCandidate(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.listCandidateChoosed.pop();
      this.candidateCodes = this.listCandidateChoosed.join(', ');
    }
  }

  chooseRecruiter(item: EmployeeRecord) {
    if (item.employee_code) {
      if (this.listRecruiterChoosed.includes(item.employee_code)) {
        this.message.info('Nhân viên này đã được chọn!');
        return;
      }
      this.listRecruiterChoosed.push(item.employee_code);
      this.recruiterCodes = this.listRecruiterChoosed.join(', ');
      console.log(this.listRecruiterChoosed);
      this.isVisiblePopListRecruiter = false;
    }
  }

  handleDeleteChosenRecruiter(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.listRecruiterChoosed.pop();
      this.recruiterCodes = this.listRecruiterChoosed.join(', ');
    }
  }

  handleConfirmUpdateInterviewSchedule() {
    if (!this.baseService.isCheckRoles([SYSTEM_ROLES.MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_EDIT])) {
      this.message.warning('Bạn không có quyền thực hiện chức năng này!');
      return;
    }
    this.dataForm.candidate_codes = this.listCandidateChoosed;
    this.dataForm.recruiter_codes = this.listRecruiterChoosed;
    this.manageRecruitment.updateInterviewSession(this.dataForm).subscribe({
      next: (res) => {
        this.message.success('Thành công!');
        this.recallData.emit();
        this.handleCancel();
      },
      error: (err) => {
        console.log(err);
        this.message.error(err.error.result.message);
      },
    });
  }

  isVisiblePopListCandidate: boolean = false;
  isVisiblePopListJobPost: boolean = false;
  isVisiblePopListRecruiter: boolean = false;

  listCandidate: Candidate[] = [];
  listRecruiter: EmployeeRecord[] = [];
  listJobPost: JobPost[] = [];
  candidateCodes = '';
  listCandidateChoosed: string[] = [];
  recruiterCodes = '';
  listRecruiterChoosed: string[] = [];
}
