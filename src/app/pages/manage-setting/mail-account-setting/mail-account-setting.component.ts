import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentsModule } from '../../../shared/components/components.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ManageSettingService } from '../manage-setting.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { MailAccount } from '../../../shared/models/mailAccount.model';

@Component({
  selector: 'app-mail-account-setting',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    NzTableModule,
    NzSelectModule,
    NzInputModule,
    FormsModule,
    NzCollapseModule,
    NzIconModule,
    NzSpinModule,
    NzGridModule,
    NzFormModule,
  ],
  templateUrl: './mail-account-setting.component.html',
  styleUrls: ['./mail-account-setting.component.scss'],
})
export class MailAccountSettingComponent {
  breadcrumbs = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Tài khoản email', link: '/manage-setting/mail-account-setting' },
  ];

  listMailAccounts: MailAccount[] = [];

  constructor(private settingService: ManageSettingService, private store: Store<AppState>) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.getListMailAccounts();
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }
  getListMailAccounts() {
    this.settingService.getMailAccounts().subscribe({
      next: (response) => {
        this.listMailAccounts = response.data || [];
      },
      error: (error) => {
        console.error('Error fetching mail accounts:', error);
      },
    });
  }

  dataInput: MailAccount = {};
  isPopupCreateMailAccountVisible: boolean = false;
  showPopupCreateMailAccount() {
    this.isPopupCreateMailAccountVisible = true;
  }
  handleCreateMailAccount() {
    this.settingService.createMailAccount(this.dataInput).subscribe({
      next: (response) => {
        this.isPopupCreateMailAccountVisible = false;
        this.getListMailAccounts();
        this.dataInput = {};
      },
      error: (error) => {
        console.error('Error creating mail account:', error);
      },
    });
  }

  isPopupEditMailAccountVisible: boolean = false;
  currentMailAccount: MailAccount = {};
  showPopupEditMailAccount(mailAccount: MailAccount) {
    this.currentMailAccount = { ...mailAccount };
    this.isPopupEditMailAccountVisible = true;
  }
  handleEditMailAccount() {
    this.settingService.updateMailAccount(this.currentMailAccount).subscribe({
      next: (response) => {
        this.isPopupEditMailAccountVisible = false;
        this.getListMailAccounts();
        this.currentMailAccount = {};
      },
      error: (error) => {
        console.error('Error updating mail account:', error);
      },
    });
  }

  isPopupDeleteMailAccountVisible: boolean = false;
  currentMailAccountToDelete: MailAccount = {};
  showPopupDeleteMailAccount(mailAccount: MailAccount) {
    this.currentMailAccountToDelete = { ...mailAccount };
    this.isPopupDeleteMailAccountVisible = true;
  }
  handleDeleteMailAccount() {
    this.settingService.deleteMailAccount(this.currentMailAccountToDelete.id || -1).subscribe({
      next: (response) => {
        this.isPopupDeleteMailAccountVisible = false;
        this.getListMailAccounts();
        this.currentMailAccountToDelete = {};
      },
      error: (error) => {
        console.error('Error deleting mail account:', error);
      },
    });
  }
}
