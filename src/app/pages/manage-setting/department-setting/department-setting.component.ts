import { Component } from '@angular/core';
import { Breadcrumb } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { ComponentsModule } from '../../../shared/components/components.module';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ManageSettingService } from '../manage-setting.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-department-setting',
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
  templateUrl: './department-setting.component.html',
  styleUrl: './department-setting.component.scss',
})
export class DepartmentSettingComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Phòng ban', link: '/manage-setting/department-setting' },
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
  }

  // Modal
  isVisiblePopup: boolean = false;
  openPopupCreateDepartment() {
    this.isVisiblePopup = true;
  }

  isVisiblePopupEdit: boolean = false;
  openPopupEditDepartment(item: any) {
    this.isVisiblePopupEdit = true;
    this.currentDataDepartment = item;
  }

  isVisiblePopupDelete: boolean = false;
  openPopupDeleteDepartment(item: any) {
    this.isVisiblePopupDelete = true;
    this.currentDataDepartment = item;
  }

  /**
   * Hàm lấy danh sách phòng ban
   */
  getListDepartment() {
    this.isLoadingTable = true;
    this.manageSettingService.getListDepartment().subscribe({
      next: (res) => {
        this.listDepartment = res.data;
      },
      error: (err) => {
        this.message.error('Lấy danh sách phòng ban thất bại');
      },
      complete: () => {
        this.isLoadingTable = false;
      },
    });
  }

  /**
   * Hàm thêm mới phòng ban
   */
  handleCreateDepartment() {
    console.log(this.dataInput);
    this.manageSettingService.createDepartment(this.dataInput).subscribe({
      next: (res) => {
        this.message.success('Thêm phòng ban thành công');
      },
      error: (err) => {
        this.message.error('Thêm phòng ban thất bại');
      },
      complete: () => {
        this.isVisiblePopup = false;
        this.getListDepartment();
      },
    });
  }

  /**
   * Hàm sửa phòng ban
   */
  handleUpdateDepartment() {
    this.manageSettingService
      .updateDepartment(this.currentDataDepartment.department_code, this.currentDataDepartment)
      .subscribe({
        next: (res) => {
          this.isVisiblePopupEdit = false;
          this.getListDepartment();
          this.currentDataDepartment = {};
          this.message.success('Thành công');
        },
        error: (err) => {
          this.message.error('Thất bại');
        },
        complete: () => {
          this.isVisiblePopupEdit = false;
        },
      });
  }

  /**
   * Hàm xóa phòng ban
   */
  handleDeleteDepartment() {
    this.manageSettingService
      .deleteDepartment(this.currentDataDepartment.department_code)
      .subscribe({
        next: (res) => {
          this.message.success('Xóa phòng ban thành công');
        },
        error: (err) => {
          this.message.error('Xóa phòng ban thất bại');
        },
        complete: () => {
          this.isVisiblePopupDelete = false;
          this.getListDepartment();
        },
      });
  }

  isLoadingTable: boolean = false;
  dataInput: any = {
    department_code: '',
    department_name: '',
    description: '',
  };
  listDepartment: any[] = [];
  currentDataDepartment: any = {};
}
