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
import { LeaveType } from '../../../shared/models/leaveType.model';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-leave-type-setting',
  standalone: true,
  templateUrl: './leave-type-setting.component.html',
  styleUrls: ['./leave-type-setting.component.scss'],
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
  ],
})
export class LeaveTypeSettingComponent {
  breadcrumbs = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Loại nghỉ phép', link: '/manage-setting/leave-type-setting' },
  ];

  listLeaveTypes: LeaveType[] = [];

  constructor(private settingService: ManageSettingService, private store: Store<AppState>) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnInit() {
    this.getListLeaveTypes();
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  getListLeaveTypes() {
    this.settingService.getLeaveType().subscribe({
      next: (response) => {
        this.listLeaveTypes = response.data || [];
      },
      error: (error) => {
        console.error('Error fetching leave types:', error);
      },
    });
  }

  dataInput: LeaveType = {};
  isPopupCreateLeaveTypeVisible: boolean = false;
  showPopupCreateLeaveType() {
    this.isPopupCreateLeaveTypeVisible = true;
  }

  handleCreateLeaveType() {
    this.settingService.createLeaveType(this.dataInput).subscribe({
      next: (response) => {
        this.isPopupCreateLeaveTypeVisible = false;
        this.getListLeaveTypes();
        this.dataInput = {};
      },
      error: (error) => {
        console.error('Error creating leave type:', error);
      },
    });
  }

  isPopupEditLeaveTypeVisible: boolean = false;
  currentLeaveType: LeaveType = {};
  showPopupEditLeaveType(leaveType: LeaveType) {
    this.currentLeaveType = { ...leaveType };
    this.isPopupEditLeaveTypeVisible = true;
  }

  handleEditLeaveType() {
    this.settingService.updateLeaveType(this.currentLeaveType).subscribe({
      next: (response) => {
        this.isPopupEditLeaveTypeVisible = false;
        this.getListLeaveTypes();
        this.currentLeaveType = {};
      },
      error: (error) => {
        console.error('Error updating leave type:', error);
      },
    });
  }

  isPopupDeleteLeaveTypeVisible: boolean = false;
  currentLeaveTypeToDelete: LeaveType = {};
  showPopupDeleteLeaveType(leaveType: LeaveType) {
    this.currentLeaveTypeToDelete = { ...leaveType };
    this.isPopupDeleteLeaveTypeVisible = true;
  }

  handleDeleteLeaveType() {
    this.settingService.deleteLeaveType(this.currentLeaveTypeToDelete.id || -1).subscribe({
      next: (response) => {
        this.isPopupDeleteLeaveTypeVisible = false;
        this.getListLeaveTypes();
        this.currentLeaveTypeToDelete = {};
      },
      error: (error) => {
        console.error('Error deleting leave type:', error);
      },
    });
  }
}
