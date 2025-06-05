import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyLeaveRequestComponent } from './my-leave-request/my-leave-request.component';
import { ListLeaveRequestComponent } from './list-leave-request/list-leave-request.component';
import { AuthGuard } from '../../guard/auth.guard';
import { SYSTEM_ROLES } from '../../shared/constants/constants';

const routes: Routes = [
  {
    path: 'my-leave-requests',
    component: MyLeaveRequestComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_LEAVE_MY_LEAVE_REQUEST_VIEW],
    },
  },
  {
    path: 'list-leave-request',
    component: ListLeaveRequestComponent,
    canActivate: [AuthGuard],
    data: {
      requiredRole: [SYSTEM_ROLES.MANAGE_LEAVE_LIST_LEAVE_REQUEST_VIEW],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageLeaveRoutingModule {}
