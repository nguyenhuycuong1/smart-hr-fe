import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSettingRoutingModule } from './manage-setting-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  imports: [CommonModule, ComponentsModule, ManageSettingRoutingModule],
})
export class ManageSettingModule {}
