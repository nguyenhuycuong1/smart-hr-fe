import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { Breadcrumb, PageFilterRequest } from '../../../shared/models';
import { ManageAccountService } from '../manage-account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { BaseService } from '../../../services/app-service/base.service';
@Component({
  selector: 'app-list-role',
  standalone: false,
  templateUrl: './list-role.component.html',
  styleUrl: './list-role.component.scss',
})
export class ListRoleComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách quyền', link: '/manage-account/list-role' },
  ];

  pageSize: number = 0;
  pageNumber: number = 0;

  listGroupRoles: any[] = [];

  constructor(
    private store: Store<AppState>,
    private manageAccountService: ManageAccountService,
    private message: NzMessageService,
    private baseService: BaseService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.getListGroupRoles({ pageNumber: this.pageNumber, pageSize: this.pageSize });
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  isLoading: boolean = false;
  getListGroupRoles(page: { pageSize: number; pageNumber: number }) {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      filter: {},
    };
    this.manageAccountService.getListGroupRoles(request).subscribe({
      next: (res) => {
        this.listGroupRoles = res.data;
        let index = this.listGroupRoles.findIndex((role) => role.name === 'admin_business');

        if (index !== -1) {
          let adminRole = this.listGroupRoles.splice(index, 1)[0];
          this.listGroupRoles.unshift(adminRole);
        }
      },
      error: (err) => {
        console.log(err);
        this.message.error('Lấy danh sách quyền thất bại');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Xóa quyền
   * @param groupCode
   */
  deleteRole(groupCode: string) {
    this.manageAccountService.deleteGroupRole(groupCode).subscribe({
      next: (res) => {
        this.getListGroupRoles({ pageNumber: this.pageNumber, pageSize: this.pageSize });
        this.message.success('Xóa quyền thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Xóa quyền thất bại');
      },
    });
  }

  /**
   * Xử lý sự kiện click vào các button có trên màn hình danh sách quyền
   */

  actionTypeModal: 'update' | 'view' = 'update';
  currentDataRole: any = {};
  isvisibleModalEditRole: boolean = false;
  handleShowModalEditRole(actionType: 'update' | 'view', data: any) {
    this.currentDataRole = data;
    this.isvisibleModalEditRole = true;
    this.actionTypeModal = actionType;
  }

  isvisibleModalCreateRole: boolean = false;
  handleShowModalCreateRole() {
    this.isvisibleModalCreateRole = true;
  }

  isvisiblePopupCofirm: boolean = false;
  typePopup: 'delete' | 'update' | 'add' = 'delete';
  currentData: any = {};
  dataName: string = 'quyền';
  handleShowModalCofirm(typePopup: 'delete' | 'update' | 'add', data: any) {
    this.isvisiblePopupCofirm = true;
    this.typePopup = typePopup;
    this.currentData = data;
  }

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
