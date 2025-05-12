import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManageAccountService } from '../../manage-account.service';
import { AccountUser, PageFilterRequest } from '../../../../shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modal-edit-role',
  standalone: false,
  templateUrl: './modal-edit-role.component.html',
  styleUrl: './modal-edit-role.component.scss',
})
export class ModalEditRoleComponent {
  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter<boolean>();
  @Input() actionType: 'update' | 'view' = 'update';
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter();
  @Output() recallData = new EventEmitter();

  constructor(
    private manageAccountService: ManageAccountService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getGroupRoles();
    this.getRolesByGroupCode();
  }

  getGroupRoles() {
    this.isLoading = true;
    this.manageAccountService.getListRoles().subscribe({
      next: (res) => {
        this.listRoles = res.data;
      },
      error: (err) => {
        console.log(err.result.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getRolesByGroupCode() {
    this.isLoading = true;
    this.manageAccountService.getRolesByGroupCode(this.data.name).subscribe({
      next: (res) => {
        this.data.roles = res.data.map((item: any) => item.name);
        console.log(this.data);
      },
      error: (err) => {
        console.log(err.result.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleCancel() {
    this.isvisible = false;
    this.isvisibleChange.emit(false);
  }

  update() {
    this.manageAccountService.updateGroupRole(this.data.name, this.data).subscribe({
      next: (res) => {
        this.recallData.emit();
        this.handleCancel();
        this.message.success('Cập nhật quyền thành công');
      },
      error: (err) => {
        console.log(err.result.message);
        this.message.error('Cập nhật quyền thất bại');
      },
    });
  }

  listRoles: any[] = [];
  isLoading: boolean = false;
}
