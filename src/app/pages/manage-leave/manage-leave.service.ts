import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../../shared/models/leaveRequest.model';
import { ApiResponse, LeaveBalance, PageResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ManageLeaveService {
  private readonly API_URL = environment.api_endpoint; // Replace with your actual API endpoint
  constructor(private httpClient: HttpClient) {}

  getLeaveRequests(): Observable<ApiResponse<LeaveRequest[]>> {
    return this.httpClient.get<ApiResponse<LeaveRequest[]>>(`${this.API_URL}/api/leave-requests`);
  }

  searchLeaveRequests(request: any): Observable<PageResponse<LeaveRequest[]>> {
    return this.httpClient.post<PageResponse<LeaveRequest[]>>(
      `${this.API_URL}/api/leave-requests/search`,
      request,
    );
  }

  createLeaveRequest(request: any): Observable<ApiResponse<LeaveRequest>> {
    return this.httpClient.post<ApiResponse<LeaveRequest>>(
      `${this.API_URL}/api/leave-requests/create`,
      request,
    );
  }

  updateLeaveRequest(leaveRequestId: string, request: any): Observable<ApiResponse<LeaveRequest>> {
    return this.httpClient.put<ApiResponse<LeaveRequest>>(
      `${this.API_URL}/api/leave-requests/update/${leaveRequestId}`,
      request,
    );
  }

  deleteLeaveRequest(leaveRequestId: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(
      `${this.API_URL}/api/leave-requests/delete/${leaveRequestId}`,
    );
  }

  approveLeaveRequest(
    leaveRequestId: number,
    approvedBy: string,
  ): Observable<ApiResponse<LeaveRequest>> {
    return this.httpClient.post<ApiResponse<LeaveRequest>>(
      `${this.API_URL}/api/leave-requests/approve/${leaveRequestId}/${approvedBy}`,
      {},
    );
  }

  rejectLeaveRequest(
    leaveRequestId: number,
    rejectedBy: string,
  ): Observable<ApiResponse<LeaveRequest>> {
    return this.httpClient.post<ApiResponse<LeaveRequest>>(
      `${this.API_URL}/api/leave-requests/reject/${leaveRequestId}/${rejectedBy}`,
      {},
    );
  }

  /**
   * Lấy số dư nghỉ phép của nhân viên
   * @param employeeCode
   * @returns
   */
  getLeaveBalance(employeeCode: string): Observable<ApiResponse<LeaveBalance[]>> {
    return this.httpClient.get<ApiResponse<LeaveBalance[]>>(
      `${this.API_URL}/api/leave-requests/${employeeCode}/leave-balance`,
    );
  }
}
