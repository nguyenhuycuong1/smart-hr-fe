import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManageAccountService } from '../../manage-account.service';
import { AccountUser, PageFilterRequest } from '../../../../shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmployeeService } from '../../../../services/employees/employee.service';

@Component({
  selector: 'app-modal-edit-account',
  standalone: false,
  templateUrl: './modal-edit-account.component.html',
  styleUrl: './modal-edit-account.component.scss',
})
export class ModalEditAccountComponent {
  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter<boolean>();
  @Input() actionType: 'update' | 'view' = 'update';
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter();
  @Output() recallData = new EventEmitter();

  constructor(
    private manageAccountService: ManageAccountService,
    private message: NzMessageService,
    private employeeService: EmployeeService,
  ) {
    this.dataInput = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      employeeCode: '',
      listGroupRoles: [],
    };
  }

  ngOnChanges() {
    console.log(this.data);
    this.dataInput = {
      username: this.data.username,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.attributes?.workEmail[0],
      employeeCode: this.data.attributes?.employeeCode[0],
      listGroupRoles: [],
    };
  }

  ngOnInit() {
    this.getGroupRoles();
    this.getListRoles();
    if (this.actionType == 'update') {
      this.getListEmployees();
    }
  }

  getListRoles() {
    this.manageAccountService.getRolesByUserId(this.data.id).subscribe({
      next: (res) => {
        this.userRoles = res.data.assignedRoles;
        this.dataInput.listGroupRoles = this.userRoles;
      },
      error: (err) => {
        console.log(err.result.message);
      },
    });
  }

  getGroupRoles() {
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
    });
  }

  getListEmployees() {
    const request: PageFilterRequest<any> = {
      pageSize: 10,
      pageNumber: 0,
      filter: {},
    };
    this.employeeService.getListEmployees(request).subscribe({
      next: (res) => {
        this.listEmployees = res.data;
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

  handleCancel() {
    this.isvisible = false;
    this.isvisibleChange.emit(false);
  }

  update() {
    this.manageAccountService.updateUser(this.data.id, this.dataInput).subscribe({
      next: (res) => {
        this.handleCancel();
        this.message.success('Cập nhật tài khoản thành công');
        this.recallData.emit();
      },
      error: (err) => {
        console.log(err.result.message);
        this.message.error('Cập nhật tài khoản thất bại');
      },
    });
  }

  dataInput: AccountUser;
  userRoles: string[] = [];
  listGroupRoles: any[] = [];
  listEmployees: any[] = [];
}
