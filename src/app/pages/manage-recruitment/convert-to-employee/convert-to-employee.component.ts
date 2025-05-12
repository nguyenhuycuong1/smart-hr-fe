import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { Breadcrumb, Employee, EmployeeProfile } from '../../../shared/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { ActivatedRoute } from '@angular/router';
import { Candidate, CandidateStatus } from '../../../shared/models/candidate.model';
import { EmployeeService } from '../../../services/employees/employee.service';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { ContractsService } from '../../manage-employee/list-contracts/contracts.service';

@Component({
  selector: 'app-convert-to-employee',
  standalone: false,
  templateUrl: './convert-to-employee.component.html',
  styleUrl: './convert-to-employee.component.scss',
})
export class ConvertToEmployeeComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách ứng viên', link: '/manage-recruitment/list-candidate' },
    { title: 'Tạo hợp đồng', link: '/manage-recruitment/convert-to-employee' },
  ];

  step: number = 0;

  candidateCode: string = '';

  constructor(
    private store: Store<AppState>,
    private message: NzMessageService,
    private manageRecruitment: ManageRecruitmentService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private contractService: ContractsService,
  ) {
    this.candidateCode = this.route.snapshot.paramMap.get('candidateCode') || '';
    this.breadcrumbs = [
      { title: 'Trang chủ', link: '/welcome' },
      { title: 'Danh sách ứng viên', link: '/manage-recruitment/list-candidate' },
      {
        title: 'Tạo hợp đồng',
        link: `/manage-recruitment/convert-to-employee/${this.candidateCode}`,
      },
    ];
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getCandidateInfo();
  }

  getCandidateInfo() {
    this.manageRecruitment.getCandidateByCandidateCode(this.candidateCode).subscribe({
      next: (res) => {
        this.formData = res.data;
        this.candidateData = res.data;
        this.getJobPost();
        console.log(this.formData);
      },
      error: (err) => {
        console.log(err.error.result.message);
        this.message.error(err.error.result.message);
      },
    });
  }

  getJobPost() {
    this.manageRecruitment
      .getJobPostByJobPostCode(this.candidateData.job_post_code || '')
      .subscribe({
        next: (res) => {
          this.formData.job_code = res.data.recruitment_request.job_code;
          this.formData.department_code = res.data.recruitment_request.department_code;
        },
        error: (err) => {
          console.log(err.error.result.message);
          this.message.error(err.error.result.message);
        },
      });
  }

  getEmployeeProfile() {
    this.employeeService.getProfileEmployee(this.formData.employee_code || '').subscribe({
      next: (res) => {
        this.employeeProfile = res.data || this.employeeProfile;
        this.activeContract = this.employeeProfile.contracts.find(
          (item: any) => item.status == 'Đang hoạt động',
        );
      },
      error: (err) => {
        console.log(err.error.result.message);
        this.message.error(err.error.result.message);
      },
    });
  }

  handleSaveEmployeeInfo() {
    this.employeeService.createEmployeeWithBankInfo(this.formData, this.bankInfo).subscribe({
      next: (res) => {
        this.formData = res.data;
        this.contractData.employee_code = this.formData.employee_code;
        this.contractData.status = 'Nháp';
        this.contractData.contract_type = this.formData.employee_type;
        this.contractData.start_date = this.formData.hire_date;
        this.contractData.job_position = this.formData.job_code;
        this.handleUpdateStatusCandidate();
        this.message.success('Tạo nhân viên thành công');
        this.step = 1;
      },
      error: (err) => {
        console.log(err.error.result.message);
        this.message.error(err.error.result.message);
      },
    });
  }

  handleSaveContractData() {
    this.contractService.createContract(this.contractData).subscribe({
      next: (res) => {
        this.message.success('Thành công!');
        this.getEmployeeProfile();
        this.step = 2;
      },
      error: (err) => {
        this.message.error(err.error.result.message);
      },
    });
  }

  handleUpdateStatusCandidate() {
    this.candidateData.status = CandidateStatus.NHANVIEC;
    this.manageRecruitment.updateCandidate(this.candidateData).subscribe({
      next: (res) => {
        // this.message.success('Thành công!');
      },
      error: (err) => {
        this.message.error(err.error.result.message);
      },
    });
  }

  formData: Employee = {};
  candidateData: Candidate = {};
  bankInfo: any = {};
  contractData: any = {};
  employeeProfile: EmployeeProfile = {
    employee: this.formData,
    bank_info: this.bankInfo,
    contracts: this.contractData,
  };
  activeContract: any = {};

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
