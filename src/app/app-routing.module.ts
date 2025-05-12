import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundExceptionComponent } from './shared/exceptions/404.exception.component';
import { ForbiddenExceptionComponent } from './shared/exceptions/403.exception.component';
import { AuthGuard } from './guard/auth.guard';
import { SYSTEM_ROLES } from './shared/constants/constants';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: 'manage-account',
    loadChildren: () =>
      import('./pages/manage-account/manage-account.module').then((m) => m.ManageAccountModule),
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_ACCOUNT],
    },
  },
  {
    path: 'manage-setting',
    loadChildren: () =>
      import('./pages/manage-setting/manage-setting-routing.module').then(
        (m) => m.ManageSettingRoutingModule,
      ),
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_SETTING],
    },
  },
  {
    path: 'manage-employee',
    loadChildren: () =>
      import('./pages/manage-employee/manage-employee.module').then((m) => m.ManageEmployeeModule),
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE],
    },
  },
  {
    path: 'manage-recruitment',
    loadChildren: () =>
      import('./pages/manage-recruitment/manage-recruitment.module').then(
        (m) => m.ManageRecruitmentModule,
      ),
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_RECRUITMENT],
    },
  },
  { path: '403', component: ForbiddenExceptionComponent },
  { path: '**', component: NotFoundExceptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
