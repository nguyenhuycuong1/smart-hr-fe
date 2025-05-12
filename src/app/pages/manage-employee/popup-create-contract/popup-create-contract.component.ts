import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../shared/models';
import { EmployeeService } from '../../../services/employees/employee.service';
import { ContractsService } from '../list-contracts/contracts.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-popup-create-contract',
  standalone: false,
  templateUrl: './popup-create-contract.component.html',
  styleUrl: './popup-create-contract.component.scss',
})
export class PopupCreateContractComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() width: string = '600px';
  @Input() title: string = 'Tạo hợp đồng mới';
  @Input() employeeCode: string | undefined = '';
  @Output() recallData: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private employeeService: EmployeeService,
    private contractService: ContractsService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getListEmployees();
  }

  ngOnChanges() {
    this.contractData = {
      status: 'Nháp',
      employee_code: this.employeeCode || '',
    };
  }

  handleCancel() {
    this.contractData = {
      status: 'Nháp',
      employee_code: this.employeeCode || '',
    };
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleOk() {
    this.contractService.createContract(this.contractData).subscribe({
      next: (res) => {
        this.recallData.emit();
        this.message.success('Tạo hợp đồng thành công!');
        this.handleCancel();
      },
      error: (err) => {
        console.log(err);
        this.message.error('Tạo hợp đồng không thành công!');
      },
    });
  }

  isvisiblePopupListEmployee: boolean = false;

  getListEmployees() {
    const request = {
      pageNumber: 0,
      pageSize: 0,
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
  chooseEmployee(data: any) {
    this.contractData.employee_code = data.employee_code;
    this.isvisiblePopupListEmployee = false;
  }

  contractData: any = {
    status: 'Nháp',
    employee_code: this.employeeCode || '',
  };
  listEmployees: Employee[] = [];
}
