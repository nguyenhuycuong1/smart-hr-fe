import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageFilterRequest, PageResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly API_URL = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  // param

  /**
   * lấy param
   * @param tableName
   * @param columnName
   * @returns
   */
  getParams(tableName: string, columnName: string): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${this.API_URL}/api/params/${tableName}/${columnName}`,
    );
  }

  /**
   * Thêm param
   * @param request
   * @returns
   */
  addParam(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(`${this.API_URL}/api/params`, request);
  }

  /**
   * Thêm mới/cập nhật list param
   * @param request
   * @returns
   */
  createBatchParam(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/params/create/batch`,
      request,
    );
  }

  /**
   * Xóa param
   * @param id
   */
  deleteParam(id: number) {
    return this.httpClient.delete(`${this.API_URL}/api/params/${id}`);
  }

  /**
   * Api lấy danh sách vị trí công việc
   * @returns
   */
  getListJobPositions(): Observable<any> {
    return this.httpClient.get<Observable<any>>(`${this.API_URL}/api/job-positions`);
  }

  /**
   * Api lấy danh sách phòng ban
   * @returns
   */
  getListDepartments(): Observable<any> {
    return this.httpClient.get<Observable<any>>(`${this.API_URL}/api/departments`);
  }
  /**
   * Api lấy danh sách team
   * @returns
   */
  getListTeams(): Observable<any> {
    return this.httpClient.get<Observable<any>>(`${this.API_URL}/api/teams`);
  }

  /**
   * Api lấy danh sách phòng ban theo filter
   * @param request
   * @returns
   */
  searchDepartment(request: PageFilterRequest<any>): Observable<PageResponse<any>> {
    return this.httpClient.post<PageResponse<any>>(
      `${this.API_URL}/api/departments/search`,
      request,
    );
  }

  /**
   * Api lấy danh sách chức vụ theo filter
   * @param request
   * @returns
   */
  searchJobPosition(request: PageFilterRequest<any>): Observable<PageResponse<any>> {
    return this.httpClient.post<PageResponse<any>>(
      `${this.API_URL}/api/job-positions/search`,
      request,
    );
  }

  /**
   * Api lấy danh sách team theo filter
   * @param request
   * @returns
   */
  searchTeam(request: PageFilterRequest<any>): Observable<PageResponse<any>> {
    return this.httpClient.post<PageResponse<any>>(`${this.API_URL}/api/teams/search`, request);
  }

  /**
   * Api lấy danh sách bản ghi theo table name
   * @param tableName tên bảng
   * @returns
   */
  getListToSelectField(tableName: string): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(`${this.API_URL}/api/${tableName}`);
  }

  /**
   * Api lấy danh sách bản ghi theo table name và filter
   * @param tableName tên bảng
   * @param filter filter
   * @returns
   */
  getListToSelectFieldWithFilter(
    tableName: string,
    filter: PageFilterRequest<any>,
  ): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/${tableName}/search`,
      filter,
    );
  }
}
