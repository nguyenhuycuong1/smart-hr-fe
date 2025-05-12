import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
import { ProfileComponent } from './profile/profile.component';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { UpdateInfoEmployeeComponent } from './update-info-employee/update-info-employee.component';
import { ListContractsComponent } from './list-contracts/list-contracts.component';
const routes: Routes = [
  {
    path: `profile/:employeeCode`,
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE_PROFILE_VIEW],
    },
  },
  {
    path: `list-employees`,
    component: ListEmployeesComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE_LIST_EMPLOYEE_VIEW],
    },
  },
  {
    path: `list-employees/:employeeCode`,
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE_PROFILE_VIEW],
    },
  },
  {
    path: `update-employee/:employeeCode`,
    component: UpdateInfoEmployeeComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE_LIST_EMPLOYEE_EDIT],
    },
  },
  {
    path: `create-employee`,
    component: UpdateInfoEmployeeComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE_LIST_EMPLOYEE_CREATE],
    },
  },
  {
    path: `list-contracts`,
    component: ListContractsComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_EMPLOYEE_LIST_CONTRACT_VIEW],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageEmployeeRoutingModule {}
