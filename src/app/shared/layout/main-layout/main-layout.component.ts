import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountUser, Breadcrumb } from '../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { BaseService } from '../../../services/app-service/base.service';
import { SYSTEM_ROLES } from '../../constants/constants';
import { KeycloakService } from 'keycloak-angular';
import { UserAccountService } from '../../../services/user-account/user-account.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;
  isCollapsed = false;
  @Input() infoBusiness: any;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private keycloak: KeycloakService,
    private userAccountService: UserAccountService,
    private message: NzMessageService,
  ) {
    this.breadcrumbs$ = this.store.select((state) => state.breadcrumbs);
  }

  handleRedirect(path: string) {
    this.router.navigate([path]);
  }

  handleRedirectToProfile() {
    this.router.navigate([
      `/manage-employee/profile/${this.currentUserAccount.attributes.employeeCode[0]}`,
    ]);
  }

  ngOnInit() {
    const userId = this.keycloak.getKeycloakInstance().profile?.id;
    if (userId) {
      this.userAccountService.getInfoUserAccount(userId).subscribe({
        next: (res) => {
          this.currentUserAccount = res.data;
          this.currentEmployeeCode = this.currentUserAccount?.attributes?.employeeCode[0] || '';
        },
        error: (err) => {
          this.message.warning('Tài khoản chưa gắn nhân viên!');
        },
      });
    } else {
      this.message.warning('Tài khoản chưa gắn nhân viên!');
    }
  }

  logout() {
    this.keycloak.logout();
  }
  currentUserAccount: any = {};
  currentEmployeeCode: string = '';
  userName: string = '';
  protected readonly systemRoles = SYSTEM_ROLES;
}
