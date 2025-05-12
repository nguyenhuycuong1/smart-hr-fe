import { Component } from '@angular/core';
import { ManageAccountService } from '../manage-account.service';
import { Store } from '@ngrx/store';
import { AccountUser, Breadcrumb, PageFilterRequest } from '../../../shared/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { BaseService } from '../../../services/app-service/base.service';
import { KeycloakService } from 'keycloak-angular';
@Component({
  selector: 'app-list-account',
  standalone: false,
  templateUrl: './list-account.component.html',
  styleUrl: './list-account.component.scss',
})
export class ListAccountComponent {
  breadcrumbs: Breadcrumb[] = [
    {
      title: 'Trang chủ',
      link: '/welcome',
    },
    {
      title: 'Danh sách tài khoản',
      link: '/manage-account/list-account',
    },
  ];

  pageSize: number = 0;
  pageNumber: number = 0;

  listAccounts: any[] = [];

  constructor(
    private manageAccount: ManageAccountService,
    private store: Store,
    private message: NzMessageService,
    private baseService: BaseService,
    private keycloakService: KeycloakService,
  ) {}

  ngOnInit() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
    this.getListAccounts({ pageNumber: this.pageNumber, pageSize: this.pageSize });
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  isLoading: boolean = false;
  getListAccounts(page: { pageSize: number; pageNumber: number }) {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      filter: {},
    };
    this.manageAccount.getListAccounts(request).subscribe({
      next: (res) => {
        this.listAccounts = res.data;
        let index = this.listAccounts.findIndex((user) => user.firstName === 'Admin');

        if (index !== -1) {
          let adminUser = this.listAccounts.splice(index, 1)[0];
          this.listAccounts.unshift(adminUser);
        }
      },
      error: (err) => {
        console.log(err);
        this.message.error('Lấy danh sách tài khoản thất bại');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Xóa tài khoản
   * @param userId
   */
  deleteAccount(userId: string) {
    this.manageAccount.deleteUser(userId).subscribe({
      next: (res) => {
        this.getListAccounts({ pageNumber: this.pageNumber, pageSize: this.pageSize });
        this.message.success('Xóa tài khoản thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Xóa tài khoản thất bại');
      },
    });
  }

  /**
   * Xử lý sự kiện click vào các button có trên màn hình danh sách tài khoản
   */
  currentDataAccount: any = {};
  actionTypeModal: 'update' | 'view' = 'update';
  isvisibleEditAccount: boolean = false;
  handleShowPopupEditAccount(actionTypeModal: 'update' | 'view', data: AccountUser) {
    this.actionTypeModal = actionTypeModal;
    this.isvisibleEditAccount = true;
    this.currentDataAccount = data;
  }

  isvisibleCreateAccount: boolean = false;
  handleShowPopupCreateAccount() {
    this.isvisibleCreateAccount = true;
  }

  currentData: any = {};
  typePopup: 'add' | 'update' | 'delete' = 'add';
  dataName: string = 'tài khoản';
  isvisiblePopupCofirm: boolean = false;
  handleShowPopupCofirm(typePopup: 'add' | 'update' | 'delete', data: any) {
    this.isvisiblePopupCofirm = true;
    this.typePopup = typePopup;
    this.currentData = data;
  }

  /**
   * Hàm kiểm tra quyền của user hiện tại
   */
  checkRole(roles: string[]): boolean {
    return this.baseService.isCheckRoles(roles);
  }

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
