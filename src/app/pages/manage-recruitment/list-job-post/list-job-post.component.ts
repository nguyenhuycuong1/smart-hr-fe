import { Component } from '@angular/core';
import { Breadcrumb, JobPost, PageFilterRequest } from '../../../shared/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';

@Component({
  selector: 'app-list-job-post',
  standalone: false,
  templateUrl: './list-job-post.component.html',
  styleUrl: './list-job-post.component.scss',
})
export class ListJobPostComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách tin tuyển dụng', link: 'manage-recruitment/list-job-post' },
  ];

  constructor(
    private store: Store<AppState>,
    private manageRecruitmentService: ManageRecruitmentService,
    private message: NzMessageService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getListJobPost();
    this.setupSearchDebounce();
  }

  getListJobPost() {
    const request: PageFilterRequest<JobPost> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'createdAt',
      sortOrder: 'desc',
    };
    this.isLoading = true;
    this.manageRecruitmentService.searchJobPost(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.listJobPost = res.data || [];
        this.total = res.dataCount || 0;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  deleteJobPost() {
    this.manageRecruitmentService.deleteJobPost(this.currentJobPost?.id || -1).subscribe({
      next: () => {
        this.message.success('Xóa tin tuyển dụng thành công');
        this.getListJobPost();
      },
      error: () => {
        this.message.error('Xóa tin tuyển dụng thất bại');
      },
    });
  }

  // Các phương thức xử lý sự kiện tìm kiếm theo các trường khác nhau
  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListJobPost();
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
    this.getListJobPost();
  }

  handleClearSearch(keyName: any) {
    this.searchFilter[keyName] = '';
    this.getListJobPost();
  }

  setupSearchDebounce() {
    this.searchTerms
      .pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe((term) => {
        this.common = term;
        this.getListJobPost();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  // Các phương thức xử lý sự kiện hiên thị popup

  isVisiblePopupEditJobPost: boolean = false;
  currentJobPost: JobPost | null = null;
  showPopupEditJobPost(data: JobPost) {
    this.isVisiblePopupEditJobPost = true;
    this.currentJobPost = data;
  }

  isVisiblePopupCreateJobPost: boolean = false;
  showPopupCreateJobPost() {
    this.isVisiblePopupCreateJobPost = true;
  }

  isVisiblePopupConfirm: boolean = false;
  showPopupConfirmToDelete(data: JobPost) {
    this.isVisiblePopupConfirm = true;
    this.currentJobPost = data;
  }

  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();

  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;

  listJobPost: JobPost[] = [];

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
