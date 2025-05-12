import { Component } from '@angular/core';
import { ApiResponse, Breadcrumb, JobPostRecord, PageFilterRequest } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { Candidate, CandidateStatus } from '../../../shared/models/candidate.model';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-candidate',
  standalone: false,
  templateUrl: './list-candidate.component.html',
  styleUrl: './list-candidate.component.scss',
})
export class ListCandidateComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Danh sách ứng viên', link: '/manage-recruitment/list-candidate' },
  ];

  constructor(
    private store: Store<AppState>,
    private manageRecruitment: ManageRecruitmentService,
    private message: NzMessageService,
    private router: Router,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getListCandidate();
    this.getListJobPost();
    this.setupSearchDebounce();
  }

  getListCandidate() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      sortProperty: 'id',
      sortOrder: 'DESC',
      filter: this.searchFilter,
      common: this.common,
    };
    this.manageRecruitment.searchCandidate(request).subscribe({
      next: (res) => {
        if (res.data) {
          this.listCandidate = res.data;
        }
        this.total = res.dataCount;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleConfirmPopupEdit() {
    let apiFetch: Observable<ApiResponse<Candidate>>;
    if (!this.currentCandidate.id) {
      apiFetch = this.manageRecruitment.createCandidate(this.currentCandidate);
    } else {
      apiFetch = this.manageRecruitment.updateCandidate(this.currentCandidate);
    }
    apiFetch.subscribe({
      next: (res) => {
        this.handleCancelPopupEditCandidate();
        this.getListCandidate();
        this.message.success('Thành công!');
      },
      error: (err) => {
        console.log(err);
        this.message.error(err.error.result.message);
      },
    });
  }

  getListJobPost() {
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      sortProperty: 'id',
      sortOrder: 'ASC',
      filter: {
        is_open: true,
      },
    };
    this.manageRecruitment.searchJobPost(request).subscribe({
      next: (res) => {
        this.listJobPost = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleConfirmDeleteCandidate() {
    this.manageRecruitment.deleteCandidate(this.currentCandidate.id || -1).subscribe({
      next: (res) => {
        this.getListCandidate();
        this.message.success('Thành công!');
      },
      error: (err) => {
        console.log(err);
        this.message.error(err.error.result.message);
      },
    });
  }

  // Hàm chọn mã bài đăng khi thêm mới pipeline
  onChooseJobPostCode(data: any) {
    this.currentCandidate.job_post_code = data.job_post_code;
    this.currentCandidate.job_name = data.recruitment_request.job_position.job_name;
    this.isvisiblePopupListJobPost = false;
  }

  // Các phương thức xử lý sự kiện tìm kiếm theo các trường khác nhau
  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListCandidate();
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
    this.getListCandidate();
  }

  handleClearSearch(keyName: any) {
    this.searchFilter[keyName] = '';
    this.getListCandidate();
  }

  setupSearchDebounce() {
    this.searchTerms
      .pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe((term) => {
        this.common = term;
        this.getListCandidate();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  // Các thuộc tính và phương thức hiển thị các popup
  isvisiblePopupListJobPost: boolean = false;
  isVisiblePopupEditCandidate: boolean = false;
  currentCandidate: Candidate = {};
  showPopupEditCandidate(data: any) {
    this.currentCandidate = data;
    if (this.currentCandidate.id) {
      this.onChooseJobPostCode(data.job_position);
    }
    // this.onChooseJobPostCode(data);
    this.isVisiblePopupEditCandidate = true;
  }

  handleCancelPopupEditCandidate() {
    this.currentCandidate = {};
    this.isVisiblePopupEditCandidate = false;
  }

  isVisiblePopupConfirmDelete: boolean = false;
  showPopupConfirmDelete(data: any) {
    this.currentCandidate = data;
    this.isVisiblePopupConfirmDelete = true;
  }

  // Hàm chuyển sang trang convert to employee
  handleRedirectToConvertToEmployee(data: any) {
    this.router.navigate(['/manage-recruitment/convert-to-employee', data.candidate_code]);
  }

  listJobPost: JobPostRecord[] = [];
  listCandidate: Candidate[] = [];

  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  common: string = '';
  searchFilter: any = {};
  searchTerms: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();
  currentDate: Date = new Date();

  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
  protected readonly CANDIDATE_STATUS = CandidateStatus;
}
