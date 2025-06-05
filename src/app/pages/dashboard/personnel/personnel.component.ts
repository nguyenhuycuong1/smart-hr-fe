import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-personnel',
  standalone: false,
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss',
})
export class PersonnelComponent implements OnInit {
  isLoading: boolean = false;

  dateRange: Date[] = [];

  // Khai báo các biến dữ liệu
  overviewCard: any = {};
  departmentStats: any[] = [];
  positionStats: any[] = [];
  personnelTrend: any[] = [];
  departmentChange: any[] = [];
  ageGenderPyramid: any[] = [];
  genderRatio: any = {};
  personnelCost: any[] = [];
  costTrend: any[] = [];

  // Khai báo các biến biểu đồ
  departmentDistributionChart: EChartsCoreOption = {};
  positionDistributionChart: EChartsCoreOption = {};
  personnelTrendChart: EChartsCoreOption = {};
  departmentChangeChart: EChartsCoreOption = {};
  ageGenderPyramidChart: EChartsCoreOption = {};
  genderRatioChart: EChartsCoreOption = {};
  personnelCostChart: EChartsCoreOption = {};
  costTrendChart: EChartsCoreOption = {};

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // this.initCharts();
    const currentDate = new Date();
    // Set time to start of day (00:00:00) to avoid timezone issues
    this.dateRange[0] = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.dateRange[1] = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    if (this.dateRange.length == 0) {
      const currentDate = new Date();
      // Set time to start of day (00:00:00) to avoid timezone issues
      this.dateRange[0] = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this.dateRange[1] = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }
    const formattedDateRange = this.dateRange.map((date) => {
      return date.toISOString().split('T')[0]; // Lấy phần ngày tháng năm: YYYY-MM-DD
    });
    this.dashboardService.getPersonnelData(formattedDateRange).subscribe((response) => {
      this.overviewCard = response.data.overview_card;
      this.departmentStats = response.data.employee_count_by_department;
      this.positionStats = response.data.employee_count_by_job_position;
      this.personnelTrend = response.data.personnel_trend;
      this.departmentChange = response.data.department_change;
      this.ageGenderPyramid = response.data.age_gender_distribution.by_age_and_gender;
      this.genderRatio = response.data.age_gender_distribution.by_gender;
      this.personnelCost = response.data.personnel_costs_by_department;
      this.costTrend = response.data.personnel_cost_trends;
      this.initCharts();
      this.isLoading = false;
    });
  }

  initCharts(): void {
    this.initDepartmentDistributionChart();
    this.initPositionDistributionChart();
    this.initPersonnelTrendChart();
    this.initDepartmentChangeChart();
    this.initAgeGenderPyramidChart();
    this.initGenderRatioChart();
    this.initPersonnelCostChart();
    this.initCostTrendChart();
  }

  // Biểu đồ tròn - Phân bố nhân viên theo phòng ban
  initDepartmentDistributionChart(): void {
    this.departmentDistributionChart = {
      // title: {
      //   text: 'Phân bố nhân viên theo phòng ban',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.departmentStats.map((dept: any) => dept.name),
      },
      series: [
        {
          name: 'Số lượng nhân viên',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: this.departmentStats.map((dept: any) => ({
            value: dept.value,
            name: dept.name,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  // Biểu đồ cột - Phân bố nhân viên theo vị trí
  initPositionDistributionChart(): void {
    this.positionDistributionChart = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: this.positionStats.map((pos: any) => pos.name),
      },
      yAxis: {
        type: 'value',
        name: 'Số lượng',
      },
      series: [
        {
          name: 'Số lượng',
          type: 'bar',
          data: this.positionStats.map((pos: any) => pos.value),
          itemStyle: {
            color: function (params: any) {
              const colorList = ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#722ed1'];
              return colorList[params.dataIndex % colorList.length];
            },
          },
        },
      ],
    };
  }

  // Biểu đồ đường - Biến động nhân sự theo tháng
  initPersonnelTrendChart(): void {
    this.personnelTrendChart = {
      // title: {
      //   text: 'Biến động nhân sự theo tháng',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Tổng nhân viên', 'Nhân viên mới', 'Nhân viên nghỉ việc'],
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
        boundaryGap: false,
        data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Tổng nhân viên',
          type: 'line',
          data: this.personnelTrend.map((item: any) => item.total_employees),
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
        {
          name: 'Nhân viên mới',
          type: 'line',
          data: this.personnelTrend.map((item: any) => item.new_employees),
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#52c41a',
          },
        },
        {
          name: 'Nhân viên nghỉ việc',
          type: 'line',
          data: this.personnelTrend.map((item: any) => item.resigned_employees),
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#f5222d',
          },
        },
      ],
    };
  }

  // Biểu đồ cột chồng - Tỷ lệ biến động nhân sự theo phòng ban
  initDepartmentChangeChart(): void {
    this.departmentChangeChart = {
      // title: {
      //   text: 'Biến động nhân sự theo phòng ban (năm hiện tại)',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Nhân viên hiện tại', 'Nhân viên mới', 'Nhân viên nghỉ việc'],
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
        data: this.departmentChange.map((dept: any) => dept.department_name),
      },
      yAxis: {
        type: 'value',
        name: 'Số lượng',
      },
      series: [
        {
          name: 'Nhân viên hiện tại',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: this.departmentChange.map((dept: any) => dept.current_employees),
          color: '#1890ff',
        },
        {
          name: 'Nhân viên mới',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: this.departmentChange.map((dept: any) => dept.new_employees),
          color: '#52c41a',
        },
        {
          name: 'Nhân viên nghỉ việc',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: this.departmentChange.map((dept: any) => dept.resigned_employees),
          color: '#f5222d',
        },
      ],
    };
  }

  // Biểu đồ hình tháp - Phân bố độ tuổi và giới tính
  initAgeGenderPyramidChart(): void {
    this.ageGenderPyramidChart = {
      // title: {
      //   text: 'Phân bố độ tuổi và giới tính',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Nam', 'Nữ'],
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
        name: 'Số lượng',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: ['18-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51+'],
      },
      series: [
        {
          name: 'Nam',
          type: 'bar',
          stack: 'total',
          data: this.ageGenderPyramid
            .filter((item) => item.gender === 'Nam')
            .map((item: any) => item.count),
          color: '#1890ff',
        },
        {
          name: 'Nữ',
          type: 'bar',
          stack: 'total',
          data: this.ageGenderPyramid
            .filter((item) => item.gender === 'Nữ')
            .map((item: any) => item.count * -1), // Lấy giá trị âm để hiển thị đúng hình tháp
          color: '#f5222d',
          label: {
            formatter: function (params: any) {
              return Math.abs(params.value);
            },
          },
        },
      ],
    };
  }

  // Biểu đồ tròn - Tỷ lệ nam/nữ
  initGenderRatioChart(): void {
    this.genderRatioChart = {
      // title: {
      //   text: 'Tỷ lệ giới tính',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Nam', 'Nữ'],
      },
      series: [
        {
          name: 'Giới tính',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: [
            {
              value: Number(this.genderRatio['Nam']),
              name: 'Nam',
              itemStyle: { color: '#1890ff' },
            },
            { value: Number(this.genderRatio['Nữ']), name: 'Nữ', itemStyle: { color: '#f5222d' } },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {c} ({d}%)',
          },
        },
      ],
    };
  }

  // Biểu đồ cột chồng - Chi phí nhân sự theo phòng ban
  initPersonnelCostChart(): void {
    this.personnelCostChart = {
      // title: {
      //   text: 'Chi phí nhân sự theo phòng ban (Quý hiện tại, triệu VNĐ)',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [
          'Lương cơ bản',
          // , 'Thưởng',
          // 'Phúc lợi'
        ],
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
        data: this.personnelCost.map((dept: any) => dept.department_name),
      },
      yAxis: {
        type: 'value',
        name: 'Triệu VNĐ',
      },
      series: [
        {
          name: 'Lương cơ bản',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: this.personnelCost.map((dept: any) => Number(dept.total_salary / 1000000)),
          color: '#1890ff',
        },
        // {
        //   name: 'Thưởng',
        //   type: 'bar',
        //   stack: 'total',
        //   emphasis: {
        //     focus: 'series',
        //   },
        //   data: [120, 65, 50, 90, 40],
        //   color: '#52c41a',
        // },
        // {
        //   name: 'Phúc lợi',
        //   type: 'bar',
        //   stack: 'total',
        //   emphasis: {
        //     focus: 'series',
        //   },
        //   data: [80, 40, 35, 60, 25],
        //   color: '#faad14',
        // },
      ],
    };
  }

  // Biểu đồ đường - Xu hướng chi phí nhân sự theo quý
  initCostTrendChart(): void {
    this.costTrendChart = {
      // title: {
      //   text: 'Xu hướng chi phí nhân sự theo quý (đơn vị: triệu VNĐ)',
      //   left: 'center',
      // },
      tooltip: {
        trigger: 'axis',
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
        data: this.costTrend.map((item: any) => item.quarter),
      },
      yAxis: {
        type: 'value',
        name: 'Triệu VNĐ',
      },
      series: [
        {
          name: 'Chi phí nhân sự',
          type: 'line',
          data: this.costTrend.map((item: any) => item.total_cost / 1000000),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#722ed1',
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
                  color: 'rgba(114, 46, 209, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(114, 46, 209, 0)',
                },
              ],
            },
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
        },
      ],
    };
  }
}
