import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAccountComponent } from './list-account/list-account.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { ManageAccountRoutingModule } from './manage-account-routing.module';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ComponentsModule } from '../../shared/components/components.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ModalEditAccountComponent } from './list-account/modal-edit-account/modal-edit-account.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ModalEditRoleComponent } from './list-role/modal-edit-role/modal-edit-role.component';
import { ModalCreateAccountComponent } from './list-account/modal-create-account/modal-create-account.component';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ModalCreateRoleComponent } from './list-role/modal-create-role/modal-create-role.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@NgModule({
  declarations: [
    ListAccountComponent,
    ListRoleComponent,
    ModalEditAccountComponent,
    ModalEditRoleComponent,
    ModalCreateAccountComponent,
    ModalCreateRoleComponent,
  ],
  imports: [
    CommonModule,
    ManageAccountRoutingModule,
    ComponentsModule,
    FormsModule,
    NzTypographyModule,
    NzTableModule,
    NzIconModule,
    NzToolTipModule,
    NzModalModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    NzStatisticModule,
    NzSpinModule,
    NzPopoverModule,
  ],
})
export class ManageAccountModule {}
