import { Component } from '@angular/core';
import { ContractsService } from './contracts.service';
import { Breadcrumb, ContractStatus, PageResponse } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { debounceTime, distinct, distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExcelService } from '../../../services/excel-service/excel.service';

@Component({
  selector: 'app-list-contracts',
  standalone: false,
  templateUrl: './list-contracts.component.html',
  styleUrl: './list-contracts.component.scss',
})
export class ListContractsComponent {
  private readonly breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách hợp đồng', link: 'manage-employee/list-contracts' },
  ];

  constructor(
    private contractService: ContractsService,
    private store: Store<AppState>,
    private messageService: NzMessageService,
    private excelService: ExcelService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getListContracts();
    this.setupSearchDebounce();
  }

  // Các phương thức xử lý sự kiện tương tác với dữ liệu
  getListContracts() {
    this.isLoading = true;
    const request = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      common: this.common,
      filter: this.searchFilter,
      sortBy: 'createdAt',
      sortType: 'desc',
    };
    this.contractService.getListContracts(request).subscribe({
      next: (res: PageResponse<any>) => {
        this.listContracts = res.data;
        this.total = res.dataCount;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleDeleteContract() {
    this.contractService.deleteContract(this.currentContract.contract_code).subscribe({
      next: (res) => {
        this.getListContracts();
        this.messageService.success('Xóa hợp đồng thành công!');
      },
      error: (err) => {
        console.error(err);
        this.messageService.error('Xóa hợp đồng thất bại!');
      },
    });
  }

  handleUpdateContract() {
    this.contractService.updateContract(this.currentContract).subscribe({
      next: (res) => {
        this.getListContracts();
        this.messageService.success('Cập nhật hợp đồng thành công!');
      },
      error: (err) => {
        this.messageService.error(err.error.result.message || 'Cập nhật hợp đồng thất bại!');
      },
    });
  }
  handleExportExcel() {
    this.isLoading = true;
    const request = {
      pageNumber: 0,
      pageSize: 0, // Lấy tất cả dữ liệu
      common: this.common,
      filter: this.searchFilter,
      sortBy: 'createdAt',
      sortType: 'desc',
    };

    this.excelService.exportExcelContractData(request).subscribe({
      next: (blob: Blob) => {
        const currentDateString = new Date()
          .toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\//g, '-'); // Định dạng ngày tháng Việt Nam
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `danh-sach-hop-dong_${currentDateString}.xls`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.success('Xuất file Excel thành công!');
      },
      error: (err: any) => {
        console.log(err);
        this.messageService.error('Có lỗi xảy ra khi xuất file Excel');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Các phương thức xử lý sự kiện tìm kiếm theo các trường khác nhau
  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListContracts();
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
    this.getListContracts();
  }

  handleClearSearch(keyName: any) {
    this.searchFilter[keyName] = '';
    this.getListContracts();
  }

  setupSearchDebounce() {
    this.searchTerms
      .pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe((term) => {
        this.common = term;
        this.getListContracts();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  // Các phương thức xử lý sự kiện ẩn hiện popup
  isVisiblePopupEditContract: boolean = false;
  isVisiblePopupConfirm: boolean = false;
  isVisiblePopupCreateContract: boolean = false;
  currentContract: any = {};
  actionTypeContract: 'view' | 'edit' = 'edit';
  showPopupEditContract(contract: any) {
    this.currentContract = contract;
    this.actionTypeContract = 'edit';
    this.isVisiblePopupEditContract = true;
  }

  showPopupViewContract(contract: any) {
    this.currentContract = contract;
    this.actionTypeContract = 'view';
    this.isVisiblePopupEditContract = true;
  }

  showPopupCreateContract() {
    this.isVisiblePopupCreateContract = true;
  }

  showPopupConfirmToDelete(contract: any) {
    this.currentContract = contract;
    this.isVisiblePopupConfirm = true;
  }

  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};

  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  isLoading: boolean = false;
  listContracts: any[] = [];

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
  protected readonly ContractStatus = ContractStatus;
}
