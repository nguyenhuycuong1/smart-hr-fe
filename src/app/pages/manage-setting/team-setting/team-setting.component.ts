import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageSettingService } from '../manage-setting.service';
import { ComponentsModule } from '../../../shared/components/components.module';
import { FormsModule } from '@angular/forms';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-team-setting',
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
  templateUrl: './team-setting.component.html',
  styleUrl: './team-setting.component.scss',
})
export class TeamSettingComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
    { title: 'Đội nhóm', link: '/manage-setting/team-setting' },
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
    this.getListTeamWithDept();
  }

  getListTeamWithDept() {
    this.isLoadingTable = true;
    this.manageSettingService.getListTeamWithDept().subscribe({
      next: (res) => {
        this.listTeamWithDept = res.data;
      },
      error: (err) => {
        console.log(err);
        this.message.error('Lấy danh sách đội nhóm thất bại');
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
  handleCreateTeam() {
    this.manageSettingService.createTeam(this.dataInput).subscribe({
      next: (res) => {
        this.getListTeamWithDept();
        this.isVisiblePopup = false;
        this.dataInput = {};
        this.message.success('Thêm mới đội nhóm thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thêm mới đội nhóm thất bại');
      },
    });
  }

  /**
   * Hàm cập nhật chức vụ
   */
  handleUpdateTeam() {
    this.manageSettingService
      .updateTeam(this.currentDataTeam.team_code, this.currentDataTeam)
      .subscribe({
        next: (res) => {
          this.getListTeamWithDept();
          this.isVisiblePopupEdit = false;
          this.currentDataTeam = {};
          this.message.success('Cập nhật đội nhóm thành công');
        },
        error: (err) => {
          console.log(err);
          this.message.error('Cập nhật đội nhóm thất bại');
        },
      });
  }

  /**
   * Hàm xóa chức vụ
   */
  handleDeleteTeam() {
    this.manageSettingService.deleteTeam(this.currentDataTeam.team_code).subscribe({
      next: (res) => {
        this.getListTeamWithDept();
        this.message.success('Xóa đội nhóm thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Xóa đội nhóm thất bại');
      },
      complete: () => {
        this.isVisiblePopupCofirm = false;
      },
    });
  }

  // Modal
  isVisiblePopup: boolean = false;
  openPopupCreateTeam() {
    this.isVisiblePopup = true;
  }

  isVisiblePopupEdit: boolean = false;
  openPopupEditTeam(item: any) {
    this.isVisiblePopupEdit = true;
    this.currentDataTeam = item;
  }

  isVisiblePopupCofirm: boolean = false;
  openPopupDeleteTeam(item: any) {
    this.isVisiblePopupCofirm = true;
    this.currentDataTeam = item;
  }

  dataInput: any = {
    team_code: '',
    team_name: '',
    department_code: '',
    description: '',
  };

  isLoadingTable: boolean = false;
  listTeam: any[] = [];
  listDepartment: any[] = [];
  listTeamWithDept: any = {};
  currentDataTeam: any = {};
}
