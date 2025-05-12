import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Employee, EmployeeProfile, PageFilterRequest } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private API_URL: string = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  /**
   * Lấy danh sách nhân viên
   * @param request
   * @returns
   */
  getListEmployees(request: PageFilterRequest<any>): Observable<any> {
    return this.httpClient.post(this.API_URL + '/api/employees/search', request);
  }

  getProfileEmployee(employee_code: string): Observable<ApiResponse<EmployeeProfile>> {
    return this.httpClient.get<ApiResponse<EmployeeProfile>>(
      `${this.API_URL}/api/employees/${employee_code}`,
    );
  }

  createOrUpdateEmployee(employee: Employee): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/api/employees/create-or-update`, employee);
  }

  deleteEmployee(employee_code: string): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}/api/employees/${employee_code}`);
  }

  createEmployeeWithBankInfo(employee: Employee, bankInfo: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/api/employees/create-with-bank-info`, {
      employee: employee,
      bankInfo: bankInfo,
    });
  }
}
