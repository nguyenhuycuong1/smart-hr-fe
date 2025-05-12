import { Component, ViewEncapsulation } from '@angular/core';
import { EmployeeService } from '../../../services/employees/employee.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Breadcrumb, EmployeeProfile } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContractsService } from '../list-contracts/contracts.service';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent {
  breadcrumbs: Breadcrumb[] = [
    {
      title: 'Trang chủ',
      link: '/welcome',
    },
    {
      title: 'Profile',
      link: `/manage-employee/profile/${this.employeeCode}`,
    },
  ];
  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private store: Store,
    private message: NzMessageService,
    private contractService: ContractsService,
  ) {}

  ngOnInit() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
    this.employeeCode = this.route.snapshot.paramMap.get('employeeCode')?.toString();
    if (this.employeeCode && this.employeeCode != '') {
      this.getEmployeeProfile(this.employeeCode);
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  // Lấy dữ liệu Profile nhân sự
  getEmployeeProfile(employeeCode: string | undefined) {
    this.isLoading = true;
    if (employeeCode == null) return;
    this.employeeService.getProfileEmployee(employeeCode).subscribe({
      next: (res: any) => {
        this.employeeProfile = res.data;
        this.activeContract = this.employeeProfile.contracts.find(
          (item: any) => item.status == 'Đang hoạt động',
        );
      },
      error: (err) => {
        // console.log(err);
        this.message.error('Lấy thông tin nhân sự thất bại.');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Hàm cập nhật thông tin hợp đồng
  updateContract(type: 'edit' | 'view') {
    if (type == 'view') return;
    this.contractService.updateContract(this.currentContract).subscribe({
      next: (res) => {
        this.message.success('Cập nhật hợp đồng thành công!');
        this.getEmployeeProfile(this.employeeCode!);
      },
      error: (err) => {
        console.log(err);
        this.message.error('Cập nhật hợp đồng không thành công!');
      },
    });
  }

  // Hàm xóa hợp đồng
  deleteContract() {
    this.contractService.deleteContract(this.currentContract.contract_code).subscribe({
      next: (res) => {
        this.message.success('Xóa hợp đồng thành công!');
        this.getEmployeeProfile(this.employeeCode!);
      },
      error: (err) => {
        console.log(err);
        this.message.error('Xóa hợp đồng không thành công!');
      },
    });
  }

  // Mở popup xem hợp đồng
  currentContract: any = {};
  isVisiblePopupContract: boolean = false;
  actionTypeContract: 'view' | 'edit' = 'view';
  openPopupViewContract(contract: any) {
    this.isVisiblePopupContract = true;
    this.currentContract = contract;
    this.actionTypeContract = 'view';
  }

  openPopupEditContract(contract: any) {
    this.isVisiblePopupContract = true;
    this.currentContract = contract;
    this.actionTypeContract = 'edit';
  }

  // Mở popup tạo hợp đồng mới
  isVisiblePopupCreateContract: boolean = false;
  openPopupCreateContract() {
    this.isVisiblePopupCreateContract = true;
  }

  // Mở popup confirm xóa hợp đồng
  isVisiblePopupConfirm: boolean = false;
  openPopupConfirmDeleteContract(contract: any) {
    this.isVisiblePopupConfirm = true;
    this.currentContract = contract;
  }

  isLoading: boolean = true;
  employeeCode?: string = '';
  employeeProfile: EmployeeProfile = {
    employee: {
      employee_code: '',
      last_name: '',
      first_name: '',
      dob: '',
      hire_date: '',
      resign_date: '',
    },
    contracts: [],
    bank_info: {},
  };
  activeContract: any;
  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
