import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentsModule } from '../../../shared/components/components.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { ManageSettingService } from '../manage-setting.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { Holiday } from '../../../shared/models/holiday.model';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-holiday-setting',
  standalone: true,
  templateUrl: './holiday-setting.component.html',
  styleUrls: ['./holiday-setting.component.scss'],
  imports: [
    CommonModule,
    ComponentsModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    NzFormModule,
    FormsModule,
    NzSpinModule,
    NzSelectModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzDatePickerModule,
  ],
})
export class HolidaySettingComponent {
  breadcrumbs = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Ngày lễ', link: '/manage-setting/holiday-setting' },
  ];

  listHolidays: Holiday[] = [];

  constructor(private settingService: ManageSettingService, private store: Store<AppState>) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.getListHolidays();
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  getListHolidays() {
    this.settingService.getHolidays().subscribe({
      next: (response) => {
        this.listHolidays = response.data || [];
      },
      error: (error) => {
        console.error('Error fetching holidays:', error);
      },
    });
  }

  dataInput: Holiday = {};
  isPopupCreateHolidayVisible: boolean = false;
  showPopupCreateHoliday() {
    this.isPopupCreateHolidayVisible = true;
  }

  handleCreateHoliday() {
    this.settingService.createHoliday(this.dataInput).subscribe({
      next: (response) => {
        this.isPopupCreateHolidayVisible = false;
        this.getListHolidays();
        this.dataInput = {};
      },
      error: (error) => {
        console.error('Error creating holiday:', error);
      },
    });
  }

  isPopupEditHolidayVisible: boolean = false;
  currentHoliday: Holiday = {};
  showPopupEditHoliday(holiday: Holiday) {
    this.currentHoliday = { ...holiday };
    this.isPopupEditHolidayVisible = true;
  }

  handleEditHoliday() {
    this.settingService.updateHoliday(this.currentHoliday).subscribe({
      next: (response) => {
        this.isPopupEditHolidayVisible = false;
        this.getListHolidays();
        this.currentHoliday = {};
      },
      error: (error) => {
        console.error('Error updating holiday:', error);
      },
    });
  }

  isPopupDeleteHolidayVisible: boolean = false;
  currentHolidayToDelete: Holiday = {};
  showPopupDeleteHoliday(holiday: Holiday) {
    this.currentHolidayToDelete = { ...holiday };
    this.isPopupDeleteHolidayVisible = true;
  }

  handleDeleteHoliday() {
    this.settingService.deleteHoliday(this.currentHolidayToDelete.id || -1).subscribe({
      next: (response) => {
        this.isPopupDeleteHolidayVisible = false;
        this.getListHolidays();
        this.currentHolidayToDelete = {};
      },
      error: (error) => {
        console.error('Error deleting holiday:', error);
      },
    });
  }
}
