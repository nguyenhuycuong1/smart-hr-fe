import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PersonnelComponent } from './personnel/personnel.component';
import { MonitorComponent } from './monitor/monitor.component';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
} from 'echarts/components';
import { LineChart, BarChart, PieChart, HeatmapChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ComponentsModule } from '../../shared/components/components.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AttendanceAndLeaveComponent } from './attendance-and-leave/attendance-and-leave.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';

echarts.use([
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ToolboxComponent,
  DataZoomComponent,
  UniversalTransition,
  VisualMapComponent,
  HeatmapChart,
]);

@NgModule({
  declarations: [PersonnelComponent, MonitorComponent, AttendanceAndLeaveComponent, RecruitmentComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DashboardRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
    NzSelectModule,
    NzTypographyModule,
    NzIconModule,
    FormsModule,
    NzDatePickerModule,
    NzSpinModule,
  ],
})
export class DashboardModule {}
