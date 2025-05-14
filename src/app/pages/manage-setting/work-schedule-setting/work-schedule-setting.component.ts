import { Component } from '@angular/core';
import { Breadcrumb } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { ManageSettingService } from '../manage-setting.service';
import { WorkSchedule } from '../../../shared/models/workSchedule.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentsModule } from '../../../shared/components/components.module';
import { FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-work-schedule-setting',
  standalone: true,
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
  ],
  templateUrl: './work-schedule-setting.component.html',
  styleUrl: './work-schedule-setting.component.scss',
})
export class WorkScheduleSettingComponent {
  breadcrumbs: Breadcrumb[] = [
    {
      title: 'Trang chủ',
      link: '/welcome',
    },
    {
      title: 'Cài đặt',
      link: '/manage-setting',
    },
    {
      title: 'Ca làm việc',
      link: '/manage-setting/work-schedule-setting',
    },
  ];

  isLoadingTable = false;
  isVisiblePopup = false;
  isVisiblePopupEdit = false;
  isVisiblePopupDelete = false;

  dataInput: WorkSchedule = {};

  currentDataWorkSchedule: WorkSchedule = {};

  listWorkSchedule: WorkSchedule[] = [];

  constructor(
    private store: Store<AppState>,
    private settingService: ManageSettingService,
    private message: NzMessageService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.getListWorkSchedule();
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  getListWorkSchedule() {
    this.isLoadingTable = true;
    this.settingService.getListWorkSchedule().subscribe({
      next: (res) => {
        this.listWorkSchedule = res.data;
      },
      error: (err) => {
        console.error(err);
        this.message.error('Lấy danh sách ca làm việc thất bại');
      },
      complete: () => {
        this.isLoadingTable = false;
      },
    });
  }

  openPopupCreateWorkSchedule() {
    this.isVisiblePopup = true;
    this.dataInput = {};
  }

  openPopupEditDepartment(data: WorkSchedule) {
    this.isVisiblePopupEdit = true;
    this.currentDataWorkSchedule = { ...data };
  }

  openPopupDeleteDepartment(data: WorkSchedule) {
    this.isVisiblePopupDelete = true;
    this.currentDataWorkSchedule = { ...data };
  }

  private formatTime(time?: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  handleCreateWorkSchedule() {
    if (!this.dataInput.schedule_name) {
      this.message.warning('Vui lòng nhập tên ca làm việc');
      return;
    }

    const formattedData = {
      ...this.dataInput,
      start_time: this.formatTime(this.dataInput.start_time),
      end_time: this.formatTime(this.dataInput.end_time),
      break_start: this.formatTime(this.dataInput.break_start),
      break_end: this.formatTime(this.dataInput.break_end)
    };

    this.settingService.createWorkSchedule(formattedData).subscribe({
      next: () => {
        this.isVisiblePopup = false;
        this.getListWorkSchedule();
        this.message.success('Thêm mới ca làm việc thành công');
      },
      error: (err) => {
        console.error(err);
        this.message.error('Thêm mới ca làm việc thất bại');
      },
    });
  }

  handleUpdateWorkSchedule() {
    if (!this.currentDataWorkSchedule.schedule_name) {
      this.message.warning('Vui lòng nhập tên ca làm việc');
      return;
    }

    const formattedData = {
      ...this.currentDataWorkSchedule,
      start_time: this.formatTime(this.currentDataWorkSchedule.start_time),
      end_time: this.formatTime(this.currentDataWorkSchedule.end_time),
      break_start: this.formatTime(this.currentDataWorkSchedule.break_start),
      break_end: this.formatTime(this.currentDataWorkSchedule.break_end)
    };

    this.settingService.updateWorkSchedule(formattedData).subscribe({
      next: () => {
        this.isVisiblePopupEdit = false;
        this.getListWorkSchedule();
        this.message.success('Cập nhật ca làm việc thành công');
      },
      error: (err) => {
        console.error(err);
        this.message.error('Cập nhật ca làm việc thất bại');
      },
    });
  }

  handleDeleteWorkSchedule() {
    this.settingService.deleteWorkSchedule(this.currentDataWorkSchedule.id!).subscribe({
      next: () => {
        this.isVisiblePopupDelete = false;
        this.getListWorkSchedule();
        this.message.success('Xóa ca làm việc thành công');
      },
      error: (err) => {
        console.error(err);
        this.message.error('Xóa ca làm việc thất bại');
      },
    });
  }
}
