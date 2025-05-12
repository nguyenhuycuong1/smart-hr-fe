import { Component } from '@angular/core';
import { ComponentsModule } from '../../../shared/components/components.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ManageSettingService } from '../manage-setting.service';
import { ApiResponse, Breadcrumb } from '../../../shared/models';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-general-setting',
  standalone: true,
  imports: [ComponentsModule, NzInputModule, FormsModule, NzGridModule, CommonModule, NzSpinModule],
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.scss',
})
export class GeneralSettingComponent {
  breadcrumbs: Breadcrumb[] = [
    { link: '/welcome', title: 'Trang chủ' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { link: '/manage-setting/general-setting', title: 'Cài đặt chung' },
  ];
  isLoading: boolean = true;
  settingData: any = {};

  constructor(
    private manageSetting: ManageSettingService,
    private message: NzMessageService,
    private store: Store<AppState>,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getSettingSystem();
  }

  getSettingSystem() {
    this.manageSetting.getSettingSystem().subscribe({
      next: (res: ApiResponse<any>) => {
        this.settingData = res.data;
      },
      error: (err) => {
        console.log(err);
        this.message.error('Lấy thông tin cài đặt thất bại');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  saveSettingSystem() {
    this.isLoading = true;
    this.manageSetting.saveSettingSystem(this.settingData).subscribe({
      next: (res) => {
        this.message.success('Lưu thay đổi thành công!');
      },
      error: (err) => {
        this.message.error('Lưu thay đổi thất bại!');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  isVisibleCofirm: boolean = false;
  openPopupConfirm() {
    this.isVisibleCofirm = true;
  }
}
