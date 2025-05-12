import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAccountComponent } from './list-account/list-account.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
import { AuthGuard } from '../../guard/auth.guard';
const routes: Routes = [
  {
    path: 'list-account',
    component: ListAccountComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_ACCOUNT_LIST_ACCOUNT_VIEW],
    },
  },
  {
    path: 'list-role',
    component: ListRoleComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_ACCOUNT_LIST_ROLE_VIEW],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAccountRoutingModule {}
