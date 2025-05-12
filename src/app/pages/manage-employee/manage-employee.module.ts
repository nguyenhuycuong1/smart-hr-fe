import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ManageEmployeeRoutingModule } from './manage-employee-routing.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ComponentsModule } from '../../shared/components/components.module';
import { PopupEditContractComponent } from './popup-edit-contract/popup-edit-contract.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UpdateInfoEmployeeComponent } from './update-info-employee/update-info-employee.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ListContractsComponent } from './list-contracts/list-contracts.component';
import { PopupCreateContractComponent } from './popup-create-contract/popup-create-contract.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
@NgModule({
  declarations: [
    ProfileComponent,
    PopupEditContractComponent,
    ListEmployeesComponent,
    UpdateInfoEmployeeComponent,
    ListContractsComponent,
    PopupCreateContractComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ManageEmployeeRoutingModule,
    NzCardModule,
    NzDescriptionsModule,
    NzIconModule,
    NzGridModule,
    NzTabsModule,
    NzTableModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    FormsModule,
    NzSpinModule,
    NzTypographyModule,
    NzFlexModule,
    NzPopoverModule,
  ],
})
export class ManageEmployeeModule {}
