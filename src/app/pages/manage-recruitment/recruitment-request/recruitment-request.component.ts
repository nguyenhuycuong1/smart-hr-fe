import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import {
  PageFilterRequest,
  PageResponse,
  RecruitmentRequest,
  RecruitmentRequestRecord,
  RecruitmentRequestStatus,
} from '../../../shared/models';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { KeycloakService } from 'keycloak-angular';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';

@Component({
  selector: 'app-recruitment-request',
  standalone: false,
  templateUrl: './recruitment-request.component.html',
  styleUrl: './recruitment-request.component.scss',
})
export class RecruitmentRequestComponent {
  private readonly breadcrumbs = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Yêu cầu tuyển dụng', link: 'manage-recruitment/recruitment-request' },
  ];

  constructor(
    private store: Store<AppState>,
    private manageRecruitmentService: ManageRecruitmentService,
    private message: NzMessageService,
    private keycloak: KeycloakService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getListRecruitmentRequest();
    this.setupSearchDebounce();
  }

  // Các hàm thao tác, xử lý dữ liệu

  getListRecruitmentRequest() {
    this.isLoading = true;
    const request: PageFilterRequest<RecruitmentRequest> = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      filter: this.searchFilter,
      common: this.common,
      sortProperty: 'id',
      sortOrder: 'desc',
    };
    this.manageRecruitmentService.searchRecruitmentRequest(request).subscribe({
      next: (res: PageResponse<RecruitmentRequestRecord[]>) => {
        this.listRecruitmentRequest = res.data || [];
        this.total = res.dataCount;
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleRefresh() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.total = 0;
    this.common = '';
    this.searchFilter = {};
    this.getListRecruitmentRequest();
  }

  handleDeleteRecruitmentRequest() {
    this.manageRecruitmentService
      .deleteRecruitmentRequest(this.currentRecruitmentRequest.id)
      .subscribe({
        next: (res) => {
          this.message.success('Thành công!');
          this.getListRecruitmentRequest();
        },
        error: (err) => {
          this.message.error(err.error.result.message);
        },
      });
  }

  async handleUpdateStatus(status: RecruitmentRequestStatus) {
    if (this.setOfCheckedId.size === 0) {
      this.message.warning('Vui lòng chọn ít nhất một yêu cầu tuyển dụng!');
      return;
    }

    const updated_at = new Date();
    const updated_by = await this.keycloak.loadUserProfile().then((profile) => {
      return profile.lastName + ' ' + profile.firstName;
    });

    // Kiểm tra xem các bản ghi được chọn có cùng một status không
    const selectedRequestIds = Array.from(this.setOfCheckedId);
    const selectedRequests = this.listRecruitmentRequest
      .filter((req) => selectedRequestIds.includes(req.id || -1))
      .map((req) => ({
        ...req,
        updated_at: updated_at,
        updated_by: updated_by,
      }));

    if (selectedRequests.length > 0) {
      const firstStatus = selectedRequests[0].status;
      const hasDifferentStatus = selectedRequests.some((req) => req.status !== firstStatus);

      if (hasDifferentStatus) {
        this.message.warning('Vui lòng chỉ chọn các yêu cầu tuyển dụng có cùng trạng thái!');
        return;
      }
    }

    const username_created = this.keycloak.getUsername();
    this.manageRecruitmentService
      .updateStatusRecruitmentRequest(selectedRequests, status, username_created)
      .subscribe({
        next: (res) => {
          this.message.success('Thành công!');
          this.getListRecruitmentRequest();
          this.setOfCheckedId.clear(); // Xóa danh sách đã chọn sau khi cập nhật
        },
        error: (err) => {
          this.message.error(err.error.result.message);
        },
      });
  }

  // Các phương thức xử lý sự kiện tìm kiếm theo các trường khác nhau
  onSearchFilter(event: any) {
    if (event.keyCode === 13) {
      this.getListRecruitmentRequest();
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
    this.getListRecruitmentRequest();
  }

  handleClearSearch(keyName: any) {
    this.searchFilter[keyName] = '';
    this.getListRecruitmentRequest();
  }

  setupSearchDebounce() {
    this.searchTerms
      .pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe((term) => {
        this.common = term;
        this.getListRecruitmentRequest();
      });
  }

  searchCommon(term: string) {
    this.searchTerms.next(term);
  }

  // Xử lý sự kiện chọn checkbox

  refreshCheckedStatus(): void {
    this.checked = this.listRecruitmentRequest.every(({ id }) => this.setOfCheckedId.has(id || -1));
    this.indeterminate =
      this.listRecruitmentRequest.some(({ id }) => this.setOfCheckedId.has(id || -1)) &&
      !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id || -1, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listRecruitmentRequest.forEach(({ id }) => this.updateCheckedSet(id || -1, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  // Xử lý sự kiện đóng mở các popup
  isVisiblePopupCreateRecruitmentRequest: boolean = false;
  showPopupCreateRecruitmentRequest() {
    this.isVisiblePopupCreateRecruitmentRequest = true;
  }

  isVisiblePopupEditRecruitmentRequest: boolean = false;
  typePopup: 'view' | 'edit' = 'edit';
  currentRecruitmentRequest: RecruitmentRequestRecord = {};
  showPopupEditRecruitmentRequest(data: RecruitmentRequestRecord) {
    this.isVisiblePopupEditRecruitmentRequest = true;
    this.typePopup = 'edit';
    this.currentRecruitmentRequest = data;
  }

  showPopupViewRecruitmentRequest(data: RecruitmentRequestRecord) {
    this.isVisiblePopupEditRecruitmentRequest = true;
    this.typePopup = 'view';
    this.currentRecruitmentRequest = data;
  }

  isVisiblePopupCofirm: boolean = false;
  showPopupConfirmDelete(data: RecruitmentRequestRecord) {
    this.isVisiblePopupCofirm = true;
    this.currentRecruitmentRequest = data;
  }

  isVisiblePopupCreateJobPost: boolean = false;
  showPopupCreateJobPost() {
    if (this.setOfCheckedId.size === 0) {
      this.message.warning('Vui lòng chọn một yêu cầu tuyển dụng!');
      return;
    }

    if (this.setOfCheckedId.size > 1) {
      this.message.warning('Vui lòng chỉ chọn một yêu cầu tuyển dụng!');
      return;
    }

    // Kiểm tra xem các bản ghi được chọn có cùng một status không
    const selectedRequestIds = Array.from(this.setOfCheckedId);
    const selectedRequests = this.listRecruitmentRequest.filter((req) =>
      selectedRequestIds.includes(req.id || -1),
    );

    this.currentRecruitmentRequest = selectedRequests[0] || {};
    if (this.currentRecruitmentRequest.status === RecruitmentRequestStatus.DANGBAI) {
      this.message.warning('Yêu cầu tuyển dụng này đã được Đăng bài! Vui lòng chọn yêu cầu khác!');
      this.isVisiblePopupCreateJobPost = false;
      return;
    }
    if (this.currentRecruitmentRequest.status != RecruitmentRequestStatus.PHEDUYET) {
      this.message.warning('Vui lòng chọn bản ghi có trạng thái là Phê duyệt để Đăng bài!');
      return;
    }
    this.isVisiblePopupCreateJobPost = true;
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

  listRecruitmentRequest: RecruitmentRequestRecord[] = [];

  protected readonly recruitmentRequestStatus = RecruitmentRequestStatus;
  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
}
