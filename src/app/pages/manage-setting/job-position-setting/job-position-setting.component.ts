import { Component } from '@angular/core';
import { Breadcrumb } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../shared/components/components.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ManageSettingService } from '../manage-setting.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-job-position-setting',
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
  ],
  templateUrl: './job-position-setting.component.html',
  styleUrl: './job-position-setting.component.scss',
})
export class JobPositionSettingComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Vị trí công việc', link: '/manage-setting/job-position-setting' },
  ];

  constructor(
    private store: Store<AppState>,
    private manageSettingService: ManageSettingService,
    private message: NzMessageService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs.slice(0, -1) }));
  }

  ngOnInit() {
    this.getListDepartment();
    this.getListJobWithDept();
  }

  getListJobWithDept() {
    this.isLoadingTable = true;
    this.manageSettingService.getListJobPositionWithDepartment().subscribe({
      next: (res) => {
        this.listJobWithDept = res.data;
      },
      error: (err) => {
        console.log(err);
        this.message.error('Lấy danh sách chức vụ thất bại');
      },
      complete: () => {
        this.isLoadingTable = false;
      },
    });
  }

  getListDepartment() {
    this.manageSettingService.getListDepartment().subscribe((res) => {
      this.listDepartment = res.data;
    });
  }

  /**
   * Hàm thêm mới chức vụ
   */
  handleCreateJobPosition() {
    this.manageSettingService.createJobPosition(this.dataInput).subscribe({
      next: (res) => {
        this.getListJobWithDept();
        this.isVisiblePopup = false;
        this.dataInput = {};
        this.message.success('Thêm mới chức vụ thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thêm mới chức vụ thất bại');
      },
    });
  }

  /**
   * Hàm cập nhật chức vụ
   */
  handleUpdateJobPosition() {
    this.manageSettingService
      .updateJobPosition(this.currentDataJobPosition.job_code, this.currentDataJobPosition)
      .subscribe({
        next: (res) => {
          this.getListJobWithDept();
          this.isVisiblePopupEdit = false;
          this.currentDataJobPosition = {};
          this.message.success('Cập nhật chức vụ thành công');
        },
        error: (err) => {
          console.log(err);
          this.message.error('Cập nhật chức vụ thất bại');
        },
      });
  }

  /**
   * Hàm xóa chức vụ
   */
  handleDeleteJobPosition() {
    this.manageSettingService.deleteJobPosition(this.currentDataJobPosition.job_code).subscribe({
      next: (res) => {
        this.getListJobWithDept();
        this.message.success('Xóa chức vụ thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Xóa chức vụ thất bại');
      },
      complete: () => {
        this.isVisiblePopupCofirm = false;
      },
    });
  }

  // Modal
  isVisiblePopup: boolean = false;
  openPopupCreateJobPosition() {
    this.isVisiblePopup = true;
  }

  isVisiblePopupEdit: boolean = false;
  openPopupEditJobPosition(item: any) {
    this.isVisiblePopupEdit = true;
    this.currentDataJobPosition = item;
  }

  isVisiblePopupCofirm: boolean = false;
  openPopupDeleteJobPosition(item: any) {
    this.isVisiblePopupCofirm = true;
    this.currentDataJobPosition = item;
  }

  dataInput: any = {
    job_code: '',
    job_name: '',
    department_code: '',
    description: '',
  };

  isLoadingTable: boolean = false;
  listJobPosition: any[] = [];
  listDepartment: any[] = [];
  listJobWithDept: any = {};
  currentDataJobPosition: any = {};
}
