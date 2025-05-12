import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Breadcrumb,
  Employee,
  EmployeeRecord,
  PageFilterRequest,
  PageResponse,
} from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { EmployeeService } from '../../../services/employees/employee.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-employees',
  standalone: false,
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.scss',
})
export class ListEmployeesComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [
    {
      title: 'Trang chủ',
      link: '/welcome',
    },
    {
      title: 'Danh sách nhân viên',
      link: '/manage-employee/list-employees',
    },
  ];

  // Subjects cho debounce search
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();
  constructor(
    private store: Store<AppState>,
    private employeeService: EmployeeService,
    private router: Router,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }
  ngOnInit() {
    this.getListEmployees();
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Thiết lập debounce cho tìm kiếm
  setupSearchDebounce() {
    this.searchTerms
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500), // Đợi 500ms sau lần nhập cuối cùng
        distinctUntilChanged(), // Chỉ tìm kiếm nếu từ khóa thay đổi
      )
      .subscribe((term) => {
        this.common = term;
        this.getListEmployees();
      });
  }

  // Phương thức gọi khi người dùng nhập vào ô tìm kiếm
  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  getListEmployees() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortOrder: 'ASC',
      sortProperty: 'employeeCode',
    };

    this.employeeService.getListEmployees(request).subscribe({
      next: (res: PageResponse<EmployeeRecord[]>) => {
        this.listEmployee = res.data;
        this.total = res.dataCount;
      },
      error(err) {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleRedirectToProfile(employeeCode: string) {
    this.router.navigate([`/manage-employee/list-employees/${employeeCode}`]);
  }

  handleRedirectToEdit(employeeCode: string) {
    this.router.navigate([`/manage-employee/update-employee/${employeeCode}`]);
  }
  handleRedirectToCreate() {
    this.router.navigate([`/manage-employee/create-employee`]);
  }

  isvisiblePopupConfirm: boolean = false;
  currentEmployeeToDelete: Employee | null = null;
  showPopupConfirmDelete(employee: Employee) {
    this.currentEmployeeToDelete = employee;
    this.isvisiblePopupConfirm = true;
  }

  handleDeleteEmployee() {
    if (this.currentEmployeeToDelete) {
      this.isLoading = true;
      this.employeeService
        .deleteEmployee(this.currentEmployeeToDelete.employee_code || '')
        .subscribe({
          next: (res: any) => {
            this.getListEmployees();
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.isLoading = false;
            this.isvisiblePopupConfirm = false;
          },
        });
    }
  }

  // Các phương thức xử lý sự kiện tìm kiếm theo các trường khác nhau
  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListEmployees();
    }
  }

  onSearchFilterDate(keyName: string) {
    if (!this.searchFilter[keyName]) {
      this.searchFilter[keyName] = '';
    } else {
      const date = new Date(this.searchFilter[keyName]);
      if (date instanceof Date && !isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.searchFilter[keyName] = `${year}-${month}-${day}`;
      }
    }
    this.getListEmployees();
  }

  handleClearSearch(keyName: any) {
    this.searchFilter[keyName] = '';
    this.getListEmployees();
  }

  isLoading: boolean = false;
  listEmployee: EmployeeRecord[] | null = [];
  pageSize: number = 10;
  pageNumber: number = 1;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
