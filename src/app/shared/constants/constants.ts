export const SYSTEM_ROLES = {
  // Quản lý tài khoản
  MANAGE_ACCOUNT: 'manage-account',
  MANAGE_ACCOUNT_LIST_ACCOUNT_VIEW: 'manage-account_list-account_view',
  MANAGE_ACCOUNT_LIST_ROLE_VIEW: 'manage-account_list-role_view',
  MANAGE_ACCOUNT_LIST_ACCOUNT_CREATE: 'manage-account_list-account_create',
  MANAGE_ACCOUNT_LIST_ACCOUNT_EDIT: 'manage-account_list-account_edit',
  MANAGE_ACCOUNT_LIST_ACCOUNT_DELETE: 'manage-account_list-account_delete',
  MANAGE_ACCOUNT_LIST_ROLE_CREATE: 'manage-account_list-role_create',
  MANAGE_ACCOUNT_LIST_ROLE_EDIT: 'manage-account_list-role_edit',
  MANAGE_ACCOUNT_LIST_ROLE_DELETE: 'manage-account_list-role_delete',

  // Quản lý cài đặt
  MANAGE_SETTING: 'manage-setting',
  MANAGE_SETTING_ORG_STRUCTURE: 'manage-setting_org-structure',
  MANAGE_SETTING_LIST_DEPARTMENT_VIEW: 'manage-setting_list-department_view',
  MANAGE_SETTING_LIST_DEPARTMENT_CREATE: 'manage-setting_list-department_create',
  MANAGE_SETTING_LIST_DEPARTMENT_EDIT: 'manage-setting_list-department_edit',
  MANAGE_SETTING_LIST_DEPARTMENT_DELETE: 'manage-setting_list-department_delete',
  MANAGE_SETTING_LIST_JOB_POSITION_VIEW: 'manage-setting_list-job-position_view',
  MANAGE_SETTING_LIST_JOB_POSITION_CREATE: 'manage-setting_list-job-position_create',
  MANAGE_SETTING_LIST_JOB_POSITION_EDIT: 'manage-setting_list-job-position_edit',
  MANAGE_SETTING_LIST_JOB_POSITION_DELETE: 'manage-setting_list-job-position_delete',
  MANAGE_SETTING_LIST_TEAM_VIEW: 'manage-setting_list-team_view',
  MANAGE_SETTING_LIST_TEAM_CREATE: 'manage-setting_list-team_create',
  MANAGE_SETTING_LIST_TEAM_EDIT: 'manage-setting_list-team_edit',
  MANAGE_SETTING_LIST_TEAM_DELETE: 'manage-setting_list-team_delete',
  // Cài đặt chung
  MANAGE_SETTING_GENERAL: 'manage-setting_general',

  // Cài đặt thời gian làm việc
  MANAGE_SETTING_WORK_SCHEDULE: 'manage-setting_work-schedule',

  // Cài đặt loại nghỉ phép
  MANAGE_SETTING_LEAVE_TYPE: 'manage-setting_leave-type',

  // Cài đặt ngày lễ
  MANAGE_SETTING_HOLIDAY: 'manage-setting_holiday',

  // Quản lý nhân viên
  MANAGE_EMPLOYEE: 'manage-employee',
  // xem profile nhân viên
  MANAGE_EMPLOYEE_PROFILE_VIEW: 'manage-employee_profile_view',
  // danh sách nhân viên
  MANAGE_EMPLOYEE_LIST_EMPLOYEE_VIEW: 'manage-employee_list-employee_view',
  MANAGE_EMPLOYEE_LIST_EMPLOYEE_CREATE: 'manage-employee_list-employee_create',
  MANAGE_EMPLOYEE_LIST_EMPLOYEE_EDIT: 'manage-employee_list-employee_edit',
  MANAGE_EMPLOYEE_LIST_EMPLOYEE_DELETE: 'manage-employee_list-employee_delete',
  // danh sách hợp đồng
  MANAGE_EMPLOYEE_LIST_CONTRACT_VIEW: 'manage-employee_list-contract_view',
  MANAGE_EMPLOYEE_LIST_CONTRACT_CREATE: 'manage-employee_list-contract_create',
  MANAGE_EMPLOYEE_LIST_CONTRACT_EDIT: 'manage-employee_list-contract_edit',
  MANAGE_EMPLOYEE_LIST_CONTRACT_DELETE: 'manage-employee_list-contract_delete',

  // Quản lý tuyển dụng
  MANAGE_RECRUITMENT: 'manage-recruitment',
  // danh sách yêu cầu tuyển dụng
  MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_VIEW: 'manage-recruitment_recruitment-request_view',
  MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_CREATE: 'manage-recruitment_recruitment-request_create',
  MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_EDIT: 'manage-recruitment_recruitment-request_edit',
  MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_DELETE: 'manage-recruitment_recruitment-request_delete',
  MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_SEND_APPROVE:
    'manage-recruitment_recruitment-request_send-approve',
  MANAGE_RECRUITMENT_RECRUITMENT_REQUEST_APPROVE: 'manage-recruitment_recruitment-request_approve',
  // danh sách bài đăng tuyển dụng
  MANAGE_RECRUITMENT_JOB_POST_VIEW: 'manage-recruitment_job-post_view',
  MANAGE_RECRUITMENT_JOB_POST_CREATE: 'manage-recruitment_job-post_create',
  MANAGE_RECRUITMENT_JOB_POST_EDIT: 'manage-recruitment_job-post_edit',
  MANAGE_RECRUITMENT_JOB_POST_DELETE: 'manage-recruitment_job-post_delete',
  // danh sách ứng viên
  MANAGE_RECRUITMENT_LIST_CANDIDATE_VIEW: 'manage-recruitment_list-candidate_view',
  MANAGE_RECRUITMENT_LIST_CANDIDATE_CREATE: 'manage-recruitment_list-candidate_create',
  MANAGE_RECRUITMENT_LIST_CANDIDATE_EDIT: 'manage-recruitment_list-candidate_edit',
  MANAGE_RECRUITMENT_LIST_CANDIDATE_DELETE: 'manage-recruitment_list-candidate_delete',
  MANAGE_RECRUITMENT_LIST_CANDIDATE_CREATE_CONTRACT:
    'manage-recruitment_list-candidate_create-contract',

  // quy trình tuyển dụng
  MANAGE_RECRUITMENT_PIPELINE_VIEW: 'manage-recruitment_pipeline_view',
  MANAGE_RECRUITMENT_PIPELINE_CREATE: 'manage-recruitment_pipeline_create',
  MANAGE_RECRUITMENT_PIPELINE_EDIT: 'manage-recruitment_pipeline_edit',
  MANAGE_RECRUITMENT_PIPELINE_DELETE: 'manage-recruitment_pipeline_delete',
  MANAGE_RECRUITMENT_PIPELINE_ADD_CANDIDATE: 'manage-recruitment_pipeline_add-candidate',
  MANAGE_RECRUITMENT_PIPELINE_APPROVE_CANDIDATE: 'manage-recruitment_pipeline_approve-candidate',
  MANAGE_RECRUITMENT_PIPELINE_REMOVE_CANDIDATE: 'manage-recruitment_pipeline_remove-candidate',
  MANAGE_RECRUITMENT_PIPELINE_ADD_NOTE_CANDIDATE: 'manage-recruitment_pipeline_add-note-candidate',
  MANAGE_RECRUITMENT_PIPELINE_UPDATE_STAGE_CANDIDATE:
    'manage-recruitment_pipeline_update-stage-candidate',

  // lịch phỏng vấn
  MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_VIEW: 'manage-recruitment_interview-schedule_view',
  MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_CREATE: 'manage-recruitment_interview-schedule_create',
  MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_EDIT: 'manage-recruitment_interview-schedule_edit',
  MANAGE_RECRUITMENT_INTERVIEW_SCHEDULE_DELETE: 'manage-recruitment_interview-schedule_delete',

  // Quản lý chấm công
  MANAGE_ATTENDANCE: 'manage-attendance',

  // danh sách chấm công
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_VIEW: 'manage-attendance_list-attendance_view',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_CREATE: 'manage-attendance_list-attendance_create',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_EDIT: 'manage-attendance_list-attendance_edit',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_DELETE: 'manage-attendance_list-attendance_delete',

  // danh sách điều chỉnh chấm công
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_VIEW:
    'manage-attendance_list-attendance-adjustment_view',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_CREATE:
    'manage-attendance_list-attendance-adjustment_create',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_EDIT:
    'manage-attendance_list-attendance-adjustment_edit',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_DELETE:
    'manage-attendance_list-attendance-adjustment_delete',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_APPROVE:
    'manage-attendance_list-attendance-adjustment_approve',
  MANAGE_ATTENDANCE_LIST_ATTENDANCE_ADJUSTMENT_REJECT:
    'manage-attendance_list-attendance-adjustment_reject',

  // danh sách yêu cầu làm thêm giờ
  MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_VIEW: 'manage-attendance_list-overtime-request_view',
  MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_CREATE: 'manage-attendance_list-overtime-request_create',
  MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_EDIT: 'manage-attendance_list-overtime-request_edit',
  MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_DELETE: 'manage-attendance_list-overtime-request_delete',
  MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_APPROVE:
    'manage-attendance_list-overtime-request_approve',
  MANAGE_ATTENDANCE_LIST_OVERTIME_REQUEST_REJECT: 'manage-attendance_list-overtime-request_reject',

  // dữ liệu chấm công cá nhân
  MANAGE_ATTENDANCE_PERSONAL_ATTENDANCE_DATA_VIEW:
    'manage-attendance_personal-attendance-data_view',
  MANAGE_ATTENDANCE_PERSONAL_ATTENDANCE_DATA_CHECK_IN:
    'manage-attendance_personal-attendance-data_check-in',
  MANAGE_ATTENDANCE_PERSONAL_ATTENDANCE_DATA_CHECK_OUT:
    'manage-attendance_personal-attendance-data_check-out',

  // Quản lý nghỉ phép
  MANAGE_LEAVE: 'manage-leave',
  // Yêu cầu nghỉ phép cá nhân
  MANAGE_LEAVE_MY_LEAVE_REQUEST_VIEW: 'manage-leave_my-leave-request_view',
  MANAGE_LEAVE_MY_LEAVE_REQUEST_CREATE: 'manage-leave_my-leave-request_create',
  MANAGE_LEAVE_MY_LEAVE_REQUEST_EDIT: 'manage-leave_my-leave-request_edit',
  MANAGE_LEAVE_MY_LEAVE_REQUEST_DELETE: 'manage-leave_my-leave-request_delete',

  // Danh sách yêu cầu nghỉ phép
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_VIEW: 'manage-leave_list-leave-request_view',
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_DETAIL: 'manage-leave_list-leave-request_detail',
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_CREATE: 'manage-leave_list-leave-request_create',
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_EDIT: 'manage-leave_list-leave-request_edit',
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_DELETE: 'manage-leave_list-leave-request_delete',
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_APPROVE: 'manage-leave_list-leave-request_approve',
  MANAGE_LEAVE_LIST_LEAVE_REQUEST_REJECT: 'manage-leave_list-leave-request_reject',

  // Dashboard
  DASHBOARD: 'dashboard',
  DASHBOARD_PERSONNEL: 'dashboard_personnel',
  DASHBOARD_ATTENDANCE_AND_LEAVE: 'dashboard_attendance-and-leave',
};
