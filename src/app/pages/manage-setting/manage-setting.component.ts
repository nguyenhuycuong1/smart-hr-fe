import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ComponentsModule } from '../../shared/components/components.module';
import { Breadcrumb } from '../../shared/models';
import { updateBreadcrumb } from '../../store/breadcrumbs.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/models';
import { RouterModule } from '@angular/router';
import { SYSTEM_ROLES } from '../../shared/constants/constants';
@Component({
  selector: 'app-manage-setting',
  standalone: true,
  templateUrl: './manage-setting.component.html',
  styleUrl: './manage-setting.component.scss',
  imports: [
    CommonModule,
    ComponentsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    RouterModule,
  ],
})
export class ManageSettingComponent {
  breadcrumbs$ = new BehaviorSubject<string[]>([]);
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Cài đặt', link: '/manage-setting' },
  ];

  constructor(private store: Store<AppState>) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  route: string = '';
  handleRedirect(path: string) {
    this.route = path;
  }

  isLoading: boolean = false;
  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
