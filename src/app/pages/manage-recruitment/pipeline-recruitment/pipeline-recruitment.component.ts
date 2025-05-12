import { Component, ElementRef, ViewChild } from '@angular/core';
import { Breadcrumb, InterviewSchedule, PageFilterRequest } from '../../../shared/models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models';
import { updateBreadcrumb } from '../../../store/breadcrumbs.actions';
import { SYSTEM_ROLES } from '../../../shared/constants/constants';
import { ManageRecruitmentService } from '../manage-recruitment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Candidate, CandidateStatus } from '../../../shared/models/candidate.model';
import { BaseService } from '../../../services/app-service/base.service';

@Component({
  selector: 'app-pipeline-recruitment',
  standalone: false,
  templateUrl: './pipeline-recruitment.component.html',
  styleUrl: './pipeline-recruitment.component.scss',
})
export class PipelineRecruitmentComponent {
  breadcrumbs: Breadcrumb[] = [
    { title: 'Trang chủ', link: '/welcome' },
    { title: 'Quy trình tuyển dụng', link: '/manage-recruitment/pipeline-recruitment' },
  ];

  constructor(
    private store: Store<AppState>,
    private manageRecruitmentService: ManageRecruitmentService,
    private message: NzMessageService,
    private baseService: BaseService,
  ) {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: this.breadcrumbs }));
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({ breadcrumbs: [] }));
  }

  ngOnInit() {
    this.getPipelineState();
    this.getListJobPost();
  }

  getPipelineState() {
    this.isLoading = true;
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      sortProperty: 'stageOrder',
      sortOrder: 'ASC',
      filter: { is_open: true },
    };
    this.manageRecruitmentService.searchPipelineStage(request).subscribe({
      next: (res) => {
        this.listPipeline = res.data.map((item: any) => item.pipe_line);
        this.handleFilterPipeline();
        this.getListCandidateStage();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getListJobPost() {
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      sortProperty: 'createdAt',
      sortOrder: 'DESC',
      filter: {
        is_open: true,
      },
    };
    this.manageRecruitmentService.searchJobPost(request).subscribe({
      next: (res) => {
        this.listJobPost = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getListCandidateByJobPostCode(jobPostCode: string) {
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      sortProperty: 'appliedAt',
      sortOrder: 'DESC',
      filter: {
        job_post_code: jobPostCode,
        status: CandidateStatus.KHOITAO,
      },
    };
    this.manageRecruitmentService.searchCandidate(request).subscribe({
      next: (res) => {
        this.listCandidate = res.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getListCandidateStage() {
    const currentJobPostCode = this.listJobPost[this.currentTabIndex].job_post_code;
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      sortProperty: 'id',
      sortOrder: 'ASC',
      filter: {
        job_post_code: currentJobPostCode,
      },
    };
    this.manageRecruitmentService.searchCandidateStages(request).subscribe({
      next: (res) => {
        this.listCandidateStage = res.data;
        this.groupCandidatesByStage();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Hàm chọn mã bài đăng khi thêm mới pipeline
  onChooseJobPostCode(data: any) {
    this.createForm.job_post_code = data.job_post_code;
    this.isvisiblePopupListJobPost = false;
  }

  // Hàm xác nhận thêm mới pipeline
  onConfirmCreatePipeline() {
    this.manageRecruitmentService.createPipelineStage(this.createForm).subscribe({
      next: async (res) => {
        this.isVisiblePopupCreate = false;
        this.createForm = {
          job_post_code: null,
          stage_order: null,
          stage_name: null,
          is_open: true,
          created_at: new Date(),
        };
        this.getPipelineState();
        this.message.success('Thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }

  // Hàm xác nhận xóa pipeline
  handleCofirmDeletePipeline() {
    this.manageRecruitmentService.deletePipelineStage(this.currentPipeline.id).subscribe({
      next: async (res) => {
        this.isVisiblePopupConfirm = false;
        this.getPipelineState();
        this.message.success('Thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }

  // Hàm cập nhật lại thứ tự pipeline mỗi khi thay đổi
  handleUpdateStageOrder() {
    this.manageRecruitmentService.updateStageOrder(this.listCurrentPipeline).subscribe({
      next: async (res) => {
        // this.message.success('Thành công');
        this.getPipelineState();
      },
      error: (err) => {
        console.log(err);
        // this.message.error('Thất bại');
      },
    });
  }

  // Hàm cập nhật tên giai đoạn khi thay đổi
  handleUpdateStageName(event?: any) {
    if (event && event.keyCode != 13) {
      return;
    }
    this.manageRecruitmentService.updateStageName(this.editForm).subscribe({
      next: async (res) => {
        this.editForm = {};
        this.message.success('Thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }

  // Hàm thêm ứng viên vào giai đoạn
  handleAddCandidateStage() {
    this.manageRecruitmentService.createCandidateStages(this.createFormCandidateStage).subscribe({
      next: async (res) => {
        this.handleCancelPopupAddCandidateStage();
        this.getListCandidateStage();
        this.message.success('Thành công');
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }
  // Hàm cập nhật thông tin candidate stage
  handleUpdateCandidateStage() {
    this.manageRecruitmentService.updateCandidateStages(this.currentCandidateStage).subscribe({
      next: async (res) => {
        this.message.success('Thành công');
        this.handleCancelEditCandidateNote();
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }

  // Hàm cập nhật thông tin ứng viên
  handleUpdateCandidateInfo() {
    this.manageRecruitmentService.updateCandidate(this.currentCandidate).subscribe({
      next: async (res) => {
        if (this.currentCandidateStage.id) {
          this.handleDeleteCandidateStage();
        }
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }

  handleDeleteCandidateStage() {
    this.manageRecruitmentService.deleteCandidateStages(this.currentCandidateStage.id).subscribe({
      next: async (res) => {
        this.message.success('Thành công');
        this.getListCandidateStage();
      },
      error: (err) => {
        console.log(err);
        this.message.error('Thất bại');
      },
    });
  }

  handleDeleteAndUpdateCandidateStage(status: CandidateStatus) {
    this.manageRecruitmentService
      .deleteAndUpdateCandidateStage(this.currentCandidateStage.id, status)
      .subscribe({
        next: async (res) => {
          this.message.success('Thành công');
          this.getListCandidateStage();
        },
        error: (err) => {
          console.log(err);
          this.message.error('Thất bại');
        },
      });
  }

  // Chọn tab
  currentTabIndex: number = 0;
  onSelectTab(event: any) {
    this.currentTabIndex = event.index;
    this.handleFilterPipeline();
    this.getListCandidateStage();
  }

  // Lọc pipeline theo job post code
  handleFilterPipeline() {
    const currentJobPostCode = this.listJobPost[this.currentTabIndex].job_post_code;
    this.listCurrentPipeline = this.listPipeline.filter(
      (item: any) => item.job_post_code === currentJobPostCode,
    );
  }

  // Chọn pipeline hiện tại khi click vào nút thao tác
  currentPipeline: any = {};
  onSelectActionsPipeline(data: any) {
    this.currentPipeline = data;
  }

  currentCandidateStage: any = {};
  onSelectActionsCandidateStage(data: any) {
    this.currentCandidateStage = data;
  }

  // Sửa tên giai đoạn
  editForm: any = {};
  onEditPipeline(data: any) {
    if (!this.baseService.isCheckRoles([SYSTEM_ROLES.MANAGE_RECRUITMENT_PIPELINE_EDIT])) {
      // this.message.warning('Bạn không có quyền thực hiện chức năng này!');
      return;
    }
    this.editForm = data;
    setTimeout(() => {
      this.stageNameInput.nativeElement.focus();
    });
  }

  // Chọn ứng viên để thêm vào giai đoạn
  onAddCandidate(data: any) {
    this.createFormCandidateStage.candidate_code = data.candidate_code;
    this.createFormCandidateStage.name = data.first_name + ' ' + data.last_name;
  }

  isVisiblePopupCreate: boolean = false;
  showPopupCreate() {
    this.isVisiblePopupCreate = true;
  }

  showPopupCreatePipeline(data: any) {
    this.createForm.job_post_code = data.job_post_code;
    this.isVisiblePopupCreate = true;
  }

  handleCancelPopupCreatePipeline() {
    this.createForm = {
      job_post_code: null,
      stage_order: null,
      stage_name: null,
      is_open: true,
      created_at: new Date(),
    };
    this.isVisiblePopupCreate = false;
  }

  isvisiblePopupListJobPost: boolean = false;

  isVisiblePopupConfirm: boolean = false;
  showPopupConfirmToDelete() {
    this.isVisiblePopupConfirm = true;
  }

  isVisiblePopupAddCandidate: boolean = false;
  showPopupAddCandidate() {
    this.isVisiblePopupAddCandidate = true;
    this.createFormCandidateStage = {
      candidate_code: null,
      stage_id: this.currentPipeline.id,
      stage_name: this.currentPipeline.stage_name,
      job_post_code: this.currentPipeline.job_post_code,
      updated_at: new Date(),
      note: null,
    };
    this.getListCandidateByJobPostCode(this.currentPipeline.job_post_code);
  }

  handleCancelPopupAddCandidateStage() {
    this.createFormCandidateStage = {
      candidate_code: null,
      name: null,
      stage_code: null,
      stage_name: null,
      job_post_code: null,
      job_post_name: null,
      note: null,
    };
    this.isVisiblePopupAddCandidate = false;
  }

  isVisiblePopupEditCandidateNote: boolean = false;
  showPopupEditCandidateNote() {
    this.isVisiblePopupEditCandidateNote = true;
  }
  handleCancelEditCandidateNote() {
    this.currentCandidateStage = {};
    this.isVisiblePopupEditCandidateNote = false;
  }

  isVisibleAccepptOrReject: boolean = false;
  typePopupAcceptOrReject: 'accept' | 'reject' = 'accept';
  currentCandidate: Candidate = {};
  showPopupAcceptOrReject(data: any, type: 'accept' | 'reject') {
    if (
      !this.baseService.isCheckRoles([SYSTEM_ROLES.MANAGE_RECRUITMENT_PIPELINE_APPROVE_CANDIDATE])
    ) {
      this.message.warning('Bạn không có quyền thực hiện chức năng này!');
      return;
    }
    this.typePopupAcceptOrReject = type;
    this.currentCandidateStage = data;
    this.currentCandidate = {
      ...data.candidate,
      status: type === 'accept' ? CandidateStatus.TRUNGTUYEN : CandidateStatus.KHONGDAT,
    };
    this.isVisibleAccepptOrReject = true;
  }

  isVisiblePopupCofirmCandidate: boolean = false;
  showPopupConfirmDeleteCandidate() {
    this.isVisiblePopupCofirmCandidate = true;
  }

  currentInterviewCandidate: InterviewSchedule = {};
  isVisiblePopupCreateInterviewSession: boolean = false;
  showPopupCreateInterviewSession() {
    this.currentInterviewCandidate.candidate_codes = [this.currentCandidateStage.candidate_code];
    this.currentInterviewCandidate.job_post_code = this.currentCandidateStage.job_post_code;
    // console.log(this.currentInterviewCandidate);
    this.isVisiblePopupCreateInterviewSession = true;
  }

  // Các phương thức xử lý sự kiện kéo thả ứng viên qua các giai đoạn tuyển dụng

  dropStage(event: CdkDragDrop<any[]>) {
    if (!this.baseService.isCheckRoles([SYSTEM_ROLES.MANAGE_RECRUITMENT_PIPELINE_EDIT])) {
      this.message.warning('Bạn không có quyền thực hiện chức năng này!');
      return;
    }
    moveItemInArray(this.listCurrentPipeline, event.previousIndex, event.currentIndex);
    const listStageOrder = this.listCurrentPipeline
      .map((item: any) => {
        return item.stage_order;
      })
      .sort((a: any, b: any) => a - b);
    this.listCurrentPipeline = this.listCurrentPipeline.map((item: any, index: number) => {
      return {
        ...item,
        stage_order: listStageOrder[index],
      };
    });
    this.handleUpdateStageOrder();
  }

  stageCandidates: { [stageId: number]: any[] } = {};
  connectedDropLists: string[] = [];

  groupCandidatesByStage() {
    // this.stageCandidates = {};

    // for (const item of this.listCandidateStage) {
    //   if (!this.stageCandidates[item.stage_id]) {
    //     this.stageCandidates[item.stage_id] = [];
    //   }
    //   this.stageCandidates[item.stage_id].push(item);
    // }

    // this.connectedDropLists = this.listCurrentPipeline.map((stage) => `${stage.id}`);
    this.connectedDropLists = this.listCurrentPipeline.map((stage) => stage.id.toString());

    // Group ứng viên vào từng stage
    this.stageCandidates = {};

    for (const stage of this.listCurrentPipeline) {
      this.stageCandidates[stage.id] = this.listCandidateStage.filter(
        (item) => item.stage_id === stage.id,
      );
    }
  }

  dropCandidate(event: CdkDragDrop<any[]>, destinationStage: any) {
    if (
      !this.baseService.isCheckRoles([
        SYSTEM_ROLES.MANAGE_RECRUITMENT_PIPELINE_UPDATE_STAGE_CANDIDATE,
      ])
    ) {
      this.message.warning('Bạn không có quyền thực hiện chức năng này!');
      return;
    }
    const previousStageId = Number(
      event.previousContainer.element.nativeElement.getAttribute('data-stage-id'),
    );
    const currentStageId = Number(
      event.container.element.nativeElement.getAttribute('data-stage-id'),
    );

    if (previousStageId === currentStageId) {
      moveItemInArray(
        this.stageCandidates[currentStageId],
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const item = event.previousContainer.data[event.previousIndex];

      // Update stage_id cho đúng
      item.stage_id = currentStageId;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.manageRecruitmentService.updateCandidateStages(item).subscribe({
        next: async (res) => {
          this.message.success('Thành công');
        },
        error: (err) => {
          console.log(err);
          this.message.error('Thất bại');
        },
      });
    }
  }

  isLoading: boolean = false;

  listJobPost: any[] = [];
  listPipeline: any[] = [];
  listCurrentPipeline: any[] = [];
  listCandidate: any[] = [];
  listCandidateStage: any[] = [];

  @ViewChild('stageNameInput') stageNameInput!: ElementRef<HTMLInputElement>;

  createForm: any = {
    job_post_code: null,
    stage_order: null,
    stage_name: null,
    is_open: true,
    created_at: new Date(),
  };

  createFormCandidateStage: any = {};

  protected readonly SYSTEM_ROLES = SYSTEM_ROLES;
  protected readonly CANDIDATE_STATUS = CandidateStatus;
}
