import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ManageSettingService {
  private readonly API_URL = environment.api_endpoint;

  constructor(private httpClient: HttpClient) {}

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
}
