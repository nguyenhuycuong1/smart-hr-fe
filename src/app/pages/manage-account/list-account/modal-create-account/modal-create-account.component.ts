import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManageAccountService } from '../../manage-account.service';
import { AccountUser, PageFilterRequest } from '../../../../shared/models';
import { KeycloakService } from 'keycloak-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmployeeService } from '../../../../services/employees/employee.service';

@Component({
  selector: 'app-modal-create-account',
  standalone: false,
  templateUrl: './modal-create-account.component.html',
  styleUrl: './modal-create-account.component.scss',
})
export class ModalCreateAccountComponent {
  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter<boolean>();
  @Output() dataChange = new EventEmitter();
  @Output() recallData = new EventEmitter();

  constructor(
    private manageAccountService: ManageAccountService,
    private keycloakService: KeycloakService,
    private message: NzMessageService,
    private employeeService: EmployeeService,
  ) {
    this.dataInput = {
      username: '',
      firstName: '',
      lastName: '',
      listGroupRoles: [],
      password: '',
    };
    this.currentBusiness = this.keycloakService.getUsername().split('@')[1];
  }

  ngOnInit() {
    this.getGroupRoles();
    this.getListEmployees();
  }

  getGroupRoles() {
    this.isLoading = true;
    let request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      filter: {},
    };
    this.manageAccountService.getListGroupRoles(request).subscribe({
      next: (res) => {
        this.listGroupRoles = res.data;
      },
      error: (err) => {
        console.log(err.result.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  getListEmployees() {
    const request: PageFilterRequest<any> = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber - 1,
      filter: {
        is_active: true,
      },
      sortOrder: 'desc',
      sortProperty: 'id',
    };
    this.employeeService.getListEmployees(request).subscribe({
      next: (res) => {
        this.listEmployees = res.data;
        this.totalEmployees = res.dataCount;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isvisiblePopupListEmployee: boolean = false;

  chooseEmployee(data: any) {
    this.dataInput.employeeCode = data.employee_code;
    this.dataInput.firstName = data.first_name;
    this.dataInput.lastName = data.last_name;
    this.dataInput.email = data.email;
    this.isvisiblePopupListEmployee = false;
    this.message.info(`Đã chọn nhân viên ${data.employee_code}`);
  }

  // appendSuffix() {
  //   this.data.username = this.data.username + '@gmail.com';
  // }

  handleCancel() {
    this.isvisible = false;
    this.isvisibleChange.emit(false);
  }

  create() {
    let request: AccountUser = {
      username: this.dataInput.username + '@' + this.currentBusiness,
      password: this.dataInput.password,
      firstName: this.dataInput.firstName,
      lastName: this.dataInput.lastName,
      employeeCode: this.dataInput.employeeCode,
      email: this.dataInput.email,
      listGroupRoles: this.dataInput.listGroupRoles,
    };
    this.manageAccountService.createUser(request).subscribe({
      next: (res) => {
        this.handleCancel();
        this.recallData.emit();
        this.message.success('Tạo tài khoản thành công');
      },
      error: (err) => {
        this.message.error(err.error.result.message || 'Tạo tài khoản thất bại');
      },
    });
  }
  isLoading: boolean = false;
  currentBusiness: string;
  dataInput: AccountUser;
  listGroupRoles: any[] = [];
  listEmployees: any[] = [];

  totalEmployees: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
}
