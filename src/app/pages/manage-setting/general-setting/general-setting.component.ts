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
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { ThemeService } from '../../../services/theme-service/theme.service.fixed';

@Component({
  selector: 'app-general-setting',
  standalone: true,
  imports: [
    ComponentsModule,
    NzInputModule,
    FormsModule,
    NzGridModule,
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzColorPickerModule,
  ],
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
  infoBusiness: any = {};
  constructor(
    private manageSetting: ManageSettingService,
    private message: NzMessageService,
    private store: Store<AppState>,
    private themeService: ThemeService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getSettingSystem();
    this.getInforBusiness();
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

  getInforBusiness() {
    this.isLoading = true;
    this.manageSetting.getInforBusiness().subscribe({
      next: (res: ApiResponse<any>) => {
        this.infoBusiness = res.data;
      },
      error: (err) => {
        console.log(err);
        this.message.error('Lấy thông tin doanh nghiệp thất bại');
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
  saveInforBusiness() {
    this.isLoading = true;
    this.manageSetting.updateInforBusiness(this.infoBusiness).subscribe({
      next: (res: ApiResponse<any>) => {
        this.message.success('Cập nhật thông tin doanh nghiệp thành công!');
        // Cập nhật theme ngay khi lưu thành công
        this.themeService.changePrimaryColor(this.infoBusiness.primary_color);
        // Không cần reload nữa vì theme đã được cập nhật động
        // window.location.reload();
      },
      error: (err) => {
        console.log(err);
        this.message.error('Cập nhật thông tin doanh nghiệp thất bại!');
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

  isVisibleConfirmUpdateInfoBusiness: boolean = false;
  openPopupConfirmUpdateInfoBusiness() {
    this.isVisibleConfirmUpdateInfoBusiness = true;
  }
}
