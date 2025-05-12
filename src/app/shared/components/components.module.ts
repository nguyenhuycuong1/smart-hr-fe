import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CheckRolePipe } from '../pipes/check-role.pipe';
import { ShrBreadcrumbComponent } from './shr-breadcrum/shr-breadcrumb.component';
import { ShrButtonComponent } from './shr-button/shr-button.component';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { RouterModule } from '@angular/router';
import { NotFoundExceptionComponent } from '../exceptions/404.exception.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { ForbiddenExceptionComponent } from '../exceptions/403.exception.component';
import { ShrPopupCreateComponent } from './shr-popup/shr-popup.component';
import { ShrSelectParamComponent } from './shr-select-param/shr-select-param.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ShrPaginationComponent } from './shr-pagination/shr-pagination.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ShrSelectFieldComponent } from './shr-select-field/shr-select-field.component';
import { ShrPopupConfirmComponent } from './shr-popup-confirm/shr-popup-confirm.component';
import { HandleLableSelectFieldPipe } from '../pipes/handle-lable-select-field.pipe';
@NgModule({
  declarations: [
    ShrBreadcrumbComponent,
    ShrButtonComponent,
    CheckRolePipe,
    HandleLableSelectFieldPipe,
    MainLayoutComponent,
    NotFoundExceptionComponent,
    ForbiddenExceptionComponent,
    ShrPopupCreateComponent,
    ShrSelectParamComponent,
    ShrPaginationComponent,
    ShrSelectFieldComponent,
    ShrPopupConfirmComponent,
  ],
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzCollapseModule,
    NzLayoutModule,
    NzMenuModule,
    RouterModule,
    NzResultModule,
    NzSelectModule,
    NzDividerModule,
    NzTableModule,
    NzInputModule,
    NzPaginationModule,
  ],
  exports: [
    ShrBreadcrumbComponent,
    ShrButtonComponent,
    ShrPopupConfirmComponent,
    CheckRolePipe,
    MainLayoutComponent,
    NotFoundExceptionComponent,
    ForbiddenExceptionComponent,
    ShrPopupCreateComponent,
    ShrSelectParamComponent,
    ShrPaginationComponent,
    ShrSelectFieldComponent,
    HandleLableSelectFieldPipe,
  ],
})
export class ComponentsModule {}
