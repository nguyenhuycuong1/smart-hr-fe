import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models';
import { LeaveType } from '../../shared/models/leaveType.model';
import { Holiday } from '../../shared/models/holiday.model';
import { MailAccount } from '../../shared/models/mailAccount.model';
import { MailTemplate } from '../../shared/models/mailTeamplate.model';

@Injectable({
  providedIn: 'root',
})
export class ManageSettingService {
  private readonly API_URL = environment.api_endpoint;

  constructor(private httpClient: HttpClient) {}

  getInforBusiness(): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(`${this.API_URL}/api/tenant`);
  }

  updateInforBusiness(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.put<ApiResponse<any>>(`${this.API_URL}/api/tenant/update`, request);
  }

  /**
   * Lấy thông tin cài đặt hệ thống
   * @returns {Observable<ApiResponse<any>>}
   */
  getSettingSystem(): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(`${this.API_URL}/api/setting-system`);
  }

  /**
   * Cập nhật thay đổi cài đặt hệ thống
   * @param request
   * @returns
   */
  saveSettingSystem(request: any): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/api/setting-system`, request);
  }

  /**
   * Lấy danh sách tất cả phòng ban
   * @returns
   */
  getListDepartment() {
    return this.httpClient.get<any>(`${this.API_URL}/api/departments`);
  }

  /**
   * Thêm phòng ban
   * @param data
   * @returns
   */
  createDepartment(data: any) {
    return this.httpClient.post<any>(`${this.API_URL}/api/departments/create`, data);
  }

  /**
   * Sửa phòng ban
   * @param department_code
   * @param data
   * @returns
   */
  updateDepartment(department_code: string, data: any) {
    return this.httpClient.put<any>(`${this.API_URL}/api/departments/${department_code}`, data);
  }

  /**
   * Xóa phòng ban
   * @param department_code
   * @returns
   */
  deleteDepartment(department_code: string) {
    return this.httpClient.delete<any>(`${this.API_URL}/api/departments/${department_code}`);
  }

  /**
   * Lấy danh sách tất cả chức vụ
   * @returns
   */
  getListJobPosition() {
    return this.httpClient.get<any>(`${this.API_URL}/api/job-positions`);
  }

  /**
   * Thêm chức vụ
   * @param data
   * @returns
   */
  createJobPosition(data: any) {
    return this.httpClient.post<any>(`${this.API_URL}/api/job-positions/create`, data);
  }

  /**
   * Lấy danh sách chức vụ có phòng ban
   * @returns
   */
  getListJobPositionWithDepartment() {
    return this.httpClient.get<any>(`${this.API_URL}/api/job-positions/with-department`);
  }

  /**
   * Cập nhật chức vụ
   * @param jobCode
   * @param data
   * @returns
   */
  updateJobPosition(jobCode: string, data: any) {
    return this.httpClient.put<any>(`${this.API_URL}/api/job-positions/${jobCode}`, data);
  }

  /**
   * Xóa chức vụ
   * @param jobCode
   * @returns
   */
  deleteJobPosition(jobCode: string) {
    return this.httpClient.delete<any>(`${this.API_URL}/api/job-positions/${jobCode}`);
  }

  /**
   * Lấy danh sách tất cả đội nhóm
   * @returns
   */
  getListTeam() {
    return this.httpClient.get<any>(`${this.API_URL}/api/teams`);
  }

  /**
   * Thêm đội nhóm
   * @param data
   * @returns
   */
  createTeam(data: any) {
    return this.httpClient.post<any>(`${this.API_URL}/api/teams/create`, data);
  }

  /**
   * Cập nhật đội nhóm
   * @param teamCode
   * @param data
   * @returns
   */
  updateTeam(teamCode: string, data: any) {
    return this.httpClient.put<any>(`${this.API_URL}/api/teams/${teamCode}`, data);
  }

  /**
   * Xóa đội nhóm
   * @param teamCode
   * @returns
   */
  deleteTeam(teamCode: string) {
    return this.httpClient.delete<any>(`${this.API_URL}/api/teams/${teamCode}`);
  }

  /**
   * Lấy danh sách đội nhóm có phòng ban
   * @returns
   */
  getListTeamWithDept() {
    return this.httpClient.get<any>(`${this.API_URL}/api/teams/with-department`);
  }

  /**
   * Lấy danh sách ca làm việc
   * @returns
   */
  getListWorkSchedule() {
    return this.httpClient.get<any>(`${this.API_URL}/api/work-schedules`);
  }

  /**
   * Tạo mới ca làm việc
   * @param data
   * @returns
   */
  createWorkSchedule(data: any) {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/work-schedules/create`,
      data,
    );
  }

  /**
   * Cập nhật ca làm việc
   * @param data
   * @returns
   */
  updateWorkSchedule(data: any) {
    return this.httpClient.put<ApiResponse<any>>(
      `${this.API_URL}/api/work-schedules/update/${data.id}`,
      data,
    );
  }
  /**
   * Xóa ca làm việc
   * @param id
   * @returns
   */
  deleteWorkSchedule(id: number) {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.API_URL}/api/work-schedules/delete/${id}`,
    );
  }

  /**
   * Cập nhật thời gian làm việc trong tuần
   * @param data
   * @returns
   */
  updateWeekday(data: any) {
    return this.httpClient.put<ApiResponse<any>>(
      `${this.API_URL}/api/setting-system/update-weekday`,
      data,
    );
  }

  /**
   * Cập nhật các ngưỡng chấm công
   * @param data
   * @returns
   */
  updateThreshold(data: any) {
    return this.httpClient.put<ApiResponse<any>>(
      `${this.API_URL}/api/setting-system/update-threshold`,
      data,
    );
  }

  /**
   * Lấy danh sách loại nghỉ phép
   * @returns
   */
  getLeaveType(): Observable<ApiResponse<LeaveType[]>> {
    return this.httpClient.get<ApiResponse<LeaveType[]>>(`${this.API_URL}/api/leave-types`);
  }

  /**
   * Tạo mới loại nghỉ phép
   * @param data
   * @returns
   */
  createLeaveType(data: LeaveType): Observable<ApiResponse<LeaveType>> {
    return this.httpClient.post<ApiResponse<LeaveType>>(
      `${this.API_URL}/api/leave-types/create`,
      data,
    );
  }

  /**
   * Cập nhật loại nghỉ phép
   * @param data
   * @returns
   */
  updateLeaveType(data: LeaveType): Observable<ApiResponse<LeaveType>> {
    return this.httpClient.put<ApiResponse<LeaveType>>(
      `${this.API_URL}/api/leave-types/update/${data.id}`,
      data,
    );
  }

  /**
   * Xóa loại nghỉ phép
   * @param id
   * @returns
   */
  deleteLeaveType(id: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`${this.API_URL}/api/leave-types/${id}`);
  }

  /**
   * Lấy danh sách ngày lễ
   * @returns
   */
  getHolidays(): Observable<ApiResponse<Holiday[]>> {
    return this.httpClient.get<ApiResponse<Holiday[]>>(`${this.API_URL}/api/holidays`);
  }

  /**
   * Tạo mới ngày lễ
   * @param data
   * @returns
   */
  createHoliday(data: Holiday): Observable<ApiResponse<Holiday>> {
    return this.httpClient.post<ApiResponse<Holiday>>(`${this.API_URL}/api/holidays/create`, data);
  }

  /**
   * Cập nhật ngày lễ
   * @param data
   * @returns
   */
  updateHoliday(data: Holiday): Observable<ApiResponse<Holiday>> {
    return this.httpClient.put<ApiResponse<Holiday>>(
      `${this.API_URL}/api/holidays/update/${data.id}`,
      data,
    );
  }

  /**
   * Xóa ngày lễ
   * @param id
   * @returns
   */
  deleteHoliday(id: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`${this.API_URL}/api/holidays/${id}`);
  }

  /**
   * Lấy danh sách tài khoản email
   * @returns
   */
  getMailAccounts(): Observable<ApiResponse<MailAccount[]>> {
    return this.httpClient.get<ApiResponse<MailAccount[]>>(`${this.API_URL}/api/mail-accounts`);
  }

  /**
   * Tạo mới tài khoản email
   * @param data
   * @returns
   */
  createMailAccount(data: MailAccount): Observable<ApiResponse<MailAccount>> {
    return this.httpClient.post<ApiResponse<MailAccount>>(
      `${this.API_URL}/api/mail-accounts/create`,
      data,
    );
  }

  /**
   * Cập nhật tài khoản email
   * @param data
   * @returns
   */
  updateMailAccount(data: MailAccount): Observable<ApiResponse<MailAccount>> {
    return this.httpClient.put<ApiResponse<MailAccount>>(
      `${this.API_URL}/api/mail-accounts/update/${data.id}`,
      data,
    );
  }

  /**
   * Xóa tài khoản email
   * @param id
   * @returns
   */
  deleteMailAccount(id: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`${this.API_URL}/api/mail-accounts/${id}`);
  }

  /**
   * Lấy danh sách mẫu email
   * @returns
   */
  getMailTemplates(): Observable<ApiResponse<MailTemplate[]>> {
    return this.httpClient.get<ApiResponse<MailTemplate[]>>(`${this.API_URL}/api/mail-templates`);
  }

  /**
   * Tạo mới mẫu email
   * @param data
   * @returns
   */
  createMailTemplate(data: MailTemplate): Observable<ApiResponse<MailTemplate>> {
    return this.httpClient.post<ApiResponse<MailTemplate>>(
      `${this.API_URL}/api/mail-templates/create`,
      data,
    );
  }

  /**
   * Cập nhật mẫu email
   * @param data
   * @returns
   */
  updateMailTemplate(data: MailTemplate): Observable<ApiResponse<MailTemplate>> {
    return this.httpClient.put<ApiResponse<MailTemplate>>(
      `${this.API_URL}/api/mail-templates/update/${data.id}`,
      data,
    );
  }

  /**
   * Xóa mẫu email
   * @param id
   * @returns
   */
  deleteMailTemplate(id: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`${this.API_URL}/api/mail-templates/${id}`);
  }
}
