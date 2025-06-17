import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { EChartsCoreOption } from 'echarts/core';

@Component({
  selector: 'app-attendance-and-leave',
  standalone: false,
  templateUrl: './attendance-and-leave.component.html',
  styleUrl: './attendance-and-leave.component.scss',
})
export class AttendanceAndLeaveComponent implements OnInit {
  isLoading: boolean = false;
  dateRange: Date[] = [];

  // Khai báo các biến dữ liệu
  overviewCard: any = {};

  // Dữ liệu giả lập cho các biểu đồ
  attendanceTrend: any[] = [];
  checkinHeatmapData: any[] = [];
  checkoutHeatmapData: any[] = [];

  leaveTypeData: any[] = [];

  departmentLeaveData: any[] = [];

  leaveMonthlyTrend: any[] = [];

  topEmployees: any[] = [];

  bottomEmployees: any[] = [];

  // Khai báo các biến biểu đồ
  attendanceTrendChart: EChartsCoreOption = {};
  checkinHeatmapChart: EChartsCoreOption = {};
  leaveTypeChart: EChartsCoreOption = {};
  departmentLeaveChart: EChartsCoreOption = {};
  leaveMonthlyTrendChart: EChartsCoreOption = {};
  workingHoursChart: EChartsCoreOption = {};

  constructor(private dashboardService: DashboardService) {
    // Tạo dữ liệu mẫu cho biểu đồ heatmap
  }

  ngOnInit(): void {
    const currentDate = new Date();
    // Set time to start of day (00:00:00) to avoid timezone issues
    this.dateRange[0] = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.dateRange[1] = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.fetchData(); // Gọi hàm fetchData để lấy dữ liệu
  }

  fetchData(): void {
    this.isLoading = true;
    if (this.dateRange.length == 0) {
      const currentDate = new Date();
      this.dateRange[0] = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this.dateRange[1] = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    const formattedDateRange = this.dateRange.map((date) => {
      return date.toISOString().split('T')[0];
    });

    // Sau này sẽ gọi API lấy dữ liệu thật
    this.dashboardService.getAttendanceAndLeaveData(formattedDateRange).subscribe((response) => {
      this.overviewCard = response.data.overview_card;
      this.attendanceTrend = response.data.weekly_attendance_trend;
      this.checkinHeatmapData = response.data.check_in_distribution;
      this.checkoutHeatmapData = response.data.check_out_distribution;
      this.leaveTypeData = response.data.leave_requests_by_type;
      this.departmentLeaveData = response.data.leave_requests_by_department;
      this.leaveMonthlyTrend = response.data.leave_request_trend_by_month;
      this.topEmployees = response.data.top_highest_by_total_hours;
      this.bottomEmployees = response.data.top_lowest_by_total_hours;
      // Cập nhật các dữ liệu khác...
      this.initCharts();
      this.isLoading = false;
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }

  initCharts(): void {
    this.initAttendanceTrendChart();
    this.initCheckinHeatmapChart();
    this.initLeaveTypeChart();
    this.initDepartmentLeaveChart();
    this.initLeaveMonthlyTrendChart();
    this.initWorkingHoursChart();
  }

  // Biểu đồ cột/đường - Xu hướng chấm công theo thời gian
  initAttendanceTrendChart(): void {
    this.attendanceTrendChart = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Đúng giờ', 'Đi muộn', 'Về sớm', 'Vắng mặt'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.attendanceTrend.map((item) => this.formatDate(new Date(item.date))),
      },
      yAxis: {
        type: 'value',
        name: 'Số lượng nhân viên',
      },
      series: [
        {
          name: 'Đúng giờ',
          type: 'bar',
          data: this.attendanceTrend.map((item) => item.on_time_count),
          color: '#52c41a',
        },
        {
          name: 'Đi muộn',
          type: 'bar',
          data: this.attendanceTrend.map((item) => item.late_count),
          color: '#faad14',
        },
        {
          name: 'Về sớm',
          type: 'bar',
          data: this.attendanceTrend.map((item) => item.early_departure_count),
          color: '#f5222d',
        },
        {
          name: 'Vắng mặt',
          type: 'bar',
          data: this.attendanceTrend.map((item) => item.absence_count),
          color: '#cccccc',
        },
      ],
    };
  }

  // Biểu đồ heatmap - Phân bố thời gian check-in/check-out
  initCheckinHeatmapChart(): void {
    this.checkinHeatmapChart = {
      title: [
        {
          text: 'Check-in',
          left: '25%',
          textAlign: 'center',
        },
        {
          text: 'Check-out',
          left: '75%',
          textAlign: 'center',
        },
      ],
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const isCheckIn = params.seriesIndex === 0;
          const action = isCheckIn ? 'check-in' : 'check-out';
          return `${params.value[2]} nhân viên ${action} lúc ${params.name}`;
        },
      },
      grid: [
        {
          left: '5%',
          right: '55%',
          bottom: '10%',
          top: '10%',
          containLabel: true,
        },
        {
          left: '55%',
          right: '5%',
          bottom: '10%',
          top: '10%',
          containLabel: true,
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: [
            '7:00',
            '8:00',
            '9:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
          ],
          splitArea: { show: true },
          gridIndex: 0,
        },
        {
          type: 'category',
          data: [
            '7:00',
            '8:00',
            '9:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
          ],
          splitArea: { show: true },
          gridIndex: 1,
        },
      ],
      yAxis: [
        {
          type: 'category',
          data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
          splitArea: { show: true },
          gridIndex: 0,
        },
        {
          type: 'category',
          data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
          splitArea: { show: true },
          gridIndex: 1,
        },
      ],
      visualMap: [
        {
          min: 0,
          max: 20,
          calculable: true,
          orient: 'horizontal',
          left: '25%',
          bottom: '1%',
          text: ['Nhiều', 'Ít'],
          color: ['#d94e5d', '#eac736', '#ffffff'],
          seriesIndex: 0,
        },
        {
          min: 0,
          max: 20,
          calculable: true,
          orient: 'horizontal',
          left: '75%',
          bottom: '1%',
          text: ['Nhiều', 'Ít'],
          color: ['#d94e5d', '#eac736', '#ffffff'],
          seriesIndex: 1,
        },
      ],
      series: [
        {
          name: 'Check-in',
          type: 'heatmap',
          data: this.checkinHeatmapData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        {
          name: 'Check-out',
          type: 'heatmap',
          data: this.checkoutHeatmapData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
      ],
    };
  }

  // Biểu đồ tròn - Phân loại nghỉ phép
  initLeaveTypeChart(): void {
    this.leaveTypeChart = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ngày ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.leaveTypeData.map((item) => item.name),
      },
      series: [
        {
          name: 'Loại nghỉ phép',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: this.leaveTypeData.map((item) => ({
            value: item.value,
            name: item.name,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {c} ngày ({d}%)',
          },
        },
      ],
    };
  }

  // Biểu đồ cột xếp chồng - Nghỉ phép theo phòng ban
  initDepartmentLeaveChart(): void {
    this.departmentLeaveChart = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Đã duyệt', 'Đang chờ duyệt', 'Từ chối'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'Số ngày nghỉ phép',
      },
      yAxis: {
        type: 'category',
        data: this.departmentLeaveData.map((item) => item.department),
      },
      series: [
        {
          name: 'Đã duyệt',
          type: 'bar',
          stack: 'total',
          data: this.departmentLeaveData.map((item) => item.approved),
          color: '#52c41a',
        },
        {
          name: 'Đang chờ duyệt',
          type: 'bar',
          stack: 'total',
          data: this.departmentLeaveData.map((item) => item.pending),
          color: '#faad14',
        },
        {
          name: 'Từ chối',
          type: 'bar',
          stack: 'total',
          data: this.departmentLeaveData.map((item) => item.rejected),
          color: '#f5222d',
        },
      ],
    };
  }

  // Biểu đồ đường - Xu hướng nghỉ phép theo tháng
  initLeaveMonthlyTrendChart(): void {
    this.leaveMonthlyTrendChart = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} ngày',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.leaveMonthlyTrend.map((item) => item.month),
      },
      yAxis: {
        type: 'value',
        name: 'Số ngày nghỉ phép',
      },
      series: [
        {
          name: 'Nghỉ phép',
          type: 'line',
          data: this.leaveMonthlyTrend.map((item) => item.total),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(24, 144, 255, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(24, 144, 255, 0)',
                },
              ],
            },
          },
        },
      ],
    };
  }

  // Biểu đồ cột ngang - Top nhân viên có thời gian làm việc cao nhất/thấp nhất
  initWorkingHoursChart(): void {
    this.workingHoursChart = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Nhiều nhất', 'Ít nhất'],
        bottom: 0,
      },
      grid: [
        {
          top: '10%',
          height: '35%',
          left: '3%',
          right: '4%',
          containLabel: true,
        },
        {
          top: '55%',
          height: '35%',
          left: '3%',
          right: '4%',
          containLabel: true,
        },
      ],
      xAxis: [
        {
          type: 'value',
          name: 'Giờ',
          position: 'top',
          gridIndex: 0,
          max: this.topEmployees.reduce((max, item) => Math.max(max, item.value), 0) + 50,
        },
        {
          type: 'value',
          name: 'Giờ',
          position: 'top',
          gridIndex: 1,
          max: this.topEmployees.reduce((max, item) => Math.max(max, item.value), 0) + 50,
        },
      ],
      yAxis: [
        {
          type: 'category',
          gridIndex: 0,
          data: this.topEmployees.map((item) => item.name).reverse(),
          axisTick: { show: false },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: this.bottomEmployees.map((item) => item.name).reverse(),
          axisTick: { show: false },
        },
      ],
      series: [
        {
          name: 'Nhiều nhất',
          type: 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: this.topEmployees.map((item) => Number(item.value).toFixed(2)).reverse(),
          color: '#52c41a',
        },
        {
          name: 'Ít nhất',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: this.bottomEmployees.map((item) => Number(item.value).toFixed(2)).reverse(),
          color: '#f5222d',
        },
      ],
    };
  }
}
