import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { AccountUser, GroupRole, PageFilterRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ManageAccountService {
  private readonly url: string = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  /**
   * API lấy danh sách tài khoản
   */
  getListAccounts(request: PageFilterRequest<any>): Observable<any> {
    return this.httpClient.post(`${this.url}/api/users`, request);
  }

  /**
   * API lấy danh sách nhóm quyền
   */
  getListGroupRoles(request: PageFilterRequest<any>): Observable<any> {
    return this.httpClient.post(`${this.url}/api/groups`, request);
  }

  /**
   * API lấy danh sách quyền
   */
  getListRoles(): Observable<any> {
    return this.httpClient.get(`${this.url}/api/roles`);
  }

  /**
   * API lấy tất cả quyền của account theo user id
   */
  getRolesByUserId(userId: string): Observable<any> {
    return this.httpClient.get(`${this.url}/api/roles/${userId}`);
  }

  /**
   * API cập nhật thông tin tài khoản theo user id
   * @param userId
   * @param request
   * @returns
   */
  updateUser(userId: string, request: AccountUser): Observable<AccountUser> {
    return this.httpClient.put<AccountUser>(`${this.url}/api/users/update/${userId}`, request);
  }

  /**
   * API tạo tài khoản mới
   */
  createUser(request: AccountUser): Observable<AccountUser> {
    return this.httpClient.post<AccountUser>(`${this.url}/api/users/register`, request);
  }

  /**
   * API tạo nhóm quyền mới
   */
  createGroupRole(request: GroupRole): Observable<GroupRole> {
    return this.httpClient.post<GroupRole>(`${this.url}/api/groups/create`, request);
  }

  /**
   * API lấy danh sách quyền của nhóm quyền theo group code
   */
  getRolesByGroupCode(groupCode: string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/api/groups/roles/${groupCode}`);
  }

  /**
   * API cập nhật quyền của nhóm quyền theo group code
   */
  updateGroupRole(groupCode: string, request: GroupRole): Observable<any> {
    return this.httpClient.put<any>(`${this.url}/api/groups/roles/${groupCode}`, request);
  }

  /**
   * API xóa nhóm quyền theo group code
   */
  deleteGroupRole(groupCode: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/api/groups/roles/${groupCode}`);
  }

  /**
   * API xóa tài khoản theo user id
   */
  deleteUser(userId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/api/users/delete/${userId}`);
  }
}
