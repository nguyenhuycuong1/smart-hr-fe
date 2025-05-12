import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { Breadcrumb, Employee } from '../../../shared/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { CommonService } from '../../../services/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employees/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UpdateInfoEmployeeService } from './update-info-employee.service';

@Component({
  selector: 'app-update-info-employee',
  standalone: false,
  templateUrl: './update-info-employee.component.html',
  styleUrl: './update-info-employee.component.scss',
})
export class UpdateInfoEmployeeComponent {
  breadcrumbs: Breadcrumb[] = [
    {
      title: 'Trang chủ',
      link: '/welcome',
    },
    {
      title: 'Danh sách nhân viên',
      link: '/manage-employee/list-employees',
    },
    {
      title: 'Cập nhật thông tin nhân viên',
      link: '/manage-employee/update-info-employee',
    },
  ];

  data: any = {};
  employeeCode: string = '';
  isLoading: boolean = false;
  tabDisabled: any = {
    employeeInfo: false,
    workInfo: true,
    bankInfo: true,
  };

  constructor(
    private store: Store<AppState>,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private infoService: UpdateInfoEmployeeService,
    private router: Router,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
    this.employeeCode = this.route.snapshot.paramMap.get('employeeCode')?.toString() || '';
    if (this.employeeCode) {
      this.getProfileEmployee(this.employeeCode);
      this.tabDisabled = {
        employeeInfo: false,
        workInfo: false,
        bankInfo: false,
      };
    } else {
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.getListJobPosition();
    this.getListDepartment();
    this.getListTeam();
  }

  getProfileEmployee(employeeCode: string) {
    this.isLoading = true;
    this.employeeService.getProfileEmployee(employeeCode).subscribe({
      next: (res: any) => {
        this.employeeInfo = res.data.employee;
        this.bankInfo = res.data.bank_info || {};
        this.workInfo =
          res.data.contracts.find((item: any) => item.status == 'Đang hoạt động') || {};
        console.log(this.workInfo);
        console.log(this.bankInfo);
        this.isLoading = false;
      },
      error: (err: any) => {
        // console.log(err);
        this.isLoading = false;
      },
    });
  }

  getListJobPosition() {
    this.commonService.getListJobPositions().subscribe((res) => {
      if (res && res.data) {
        this.listPositions = res.data;
      }
    });
  }

  getListDepartment() {
    this.commonService.getListDepartments().subscribe((res) => {
      if (res && res.data) {
        this.listDepartment = res.data;
      }
    });
  }

  getListTeam() {
    this.commonService.getListTeams().subscribe((res) => {
      if (res && res.data) {
        this.listTeam = res.data;
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  saveEmployeeInfo() {
    const request: Employee = {
      employee_code: this.employeeCode,
      ...this.employeeInfo,
    };
    console.log(request);
    this.employeeService.createOrUpdateEmployee(request).subscribe({
      next: (res) => {
        this.tabDisabled.workInfo = false;
        this.tabDisabled.bankInfo = false;
        if (!this.employeeCode) {
          this.employeeCode = res.data.employee_code;
          this.router.navigate([`/manage-employee/update-employee/${this.employeeCode}`]);
        }
        this.message.success('Thành công!');
      },
      error: (err) => {
        console.log(err);
        // this.commonService.showToast('error', 'Cập nhật thông tin nhân viên thất bại!');
        this.message.error('Cập nhật thông tin nhân viên thất bại!');
      },
    });
  }

  saveWorkInfo() {
    console.log(this.workInfo);
  }
  saveBankInfo() {
    const request = {
      employee_code: this.employeeCode,
      ...this.bankInfo,
    };
    this.infoService.createOrUpdateBankInfo(request).subscribe({
      next: (res) => {
        this.message.success('Thành công!');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Cập nhật thông tin ngân hàng thất bại!');
      },
    });
  }

  isvisiblePopupConfirm: boolean = false;
  showPopupConfirmCreate() {
    this.isvisiblePopupConfirm = true;
  }

  listPositions: any[] = [];
  listDepartment: any[] = [];
  listTeam: any[] = [];
  employeeInfo: any = {};
  bankInfo: any = {};
  workInfo: any = {};
}
