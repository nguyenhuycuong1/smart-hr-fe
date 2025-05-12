import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManageAccountService } from '../../manage-account.service';
import { AccountUser, GroupRole, PageFilterRequest } from '../../../../shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-modal-create-role',
  standalone: false,
  templateUrl: './modal-create-role.component.html',
  styleUrl: './modal-create-role.component.scss',
})
export class ModalCreateRoleComponent {
  @Input() isvisible: boolean = false;
  @Output() isvisibleChange = new EventEmitter<boolean>();
  @Output() recallData = new EventEmitter();

  constructor(
    private manageAccountService: ManageAccountService,
    private message: NzMessageService,
  ) {
    this.dataInput = {
      name: '',
      description: '',
      roles: [],
    };
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.manageAccountService.getListRoles().subscribe({
      next: (res) => {
        this.listRoles = res.data;
        console.log(this.listRoles);
      },
      error: (err) => {
        console.log(err.result.message);
      },
    });
  }

  handleCancel() {
    this.isvisible = false;
    this.isvisibleChange.emit(false);
  }

  create() {
    let request: GroupRole = {
      name: this.dataInput.name,
      description: this.dataInput.description,
      roles: this.dataInput.roles,
    };
    this.manageAccountService.createGroupRole(request).subscribe({
      next: (res) => {
        console.log(res);
        this.handleCancel();
        this.recallData.emit();
        this.message.success('Tạo nhóm quyền thành công');
      },
      error: (err) => {
        console.log(err.result.message);
        this.message.error('Tạo nhóm quyền thất bại');
      },
    });
  }

  listRoles: any[] = [];
  dataInput: GroupRole;
}
