import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSettingRoutingModule } from './manage-setting-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';
@NgModule({
  imports: [CommonModule, ComponentsModule, ManageSettingRoutingModule],
  declarations: [],
})
export class ManageSettingModule {}
