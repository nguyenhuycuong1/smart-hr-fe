import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import {
  ApiResponse,
  AttendanceAdjustment,
  AttendanceRecord,
  OvertimeRequest,
  PageFilterRequest,
  PageResponse,
} from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageAttendanceService {
  private apiUrl: string = environment.api_endpoint + '/api';
  constructor(private httpClient: HttpClient) {}

  getListAttendance(
    request: PageFilterRequest<AttendanceRecord>,
  ): Observable<PageResponse<AttendanceRecord[]>> {
    const url = `${this.apiUrl}/attendance-records/search`;
    return this.httpClient.post<PageResponse<AttendanceRecord[]>>(url, request);
  }

  getAttendanceById(id: number): Observable<ApiResponse<AttendanceRecord>> {
    const url = `${this.apiUrl}/attendance-records/${id}`;
    return this.httpClient.get<ApiResponse<AttendanceRecord>>(url);
  }

  createAttendance(attendance: AttendanceRecord): Observable<ApiResponse<AttendanceRecord>> {
    const url = `${this.apiUrl}/attendance-records/create`;
    return this.httpClient.post<ApiResponse<AttendanceRecord>>(url, attendance);
  }
  updateAttendance(
    id: number,
    attendance: AttendanceRecord,
  ): Observable<ApiResponse<AttendanceRecord>> {
    const url = `${this.apiUrl}/attendance-records/update/${id}`;
    return this.httpClient.put<ApiResponse<AttendanceRecord>>(url, attendance);
  }

  deleteAttendance(id: number): Observable<ApiResponse<void>> {
    const url = `${this.apiUrl}/attendance-records/delete/${id}`;
    return this.httpClient.delete<ApiResponse<void>>(url);
  }

  /**
   * API check in attendance
   * @param employee_code
   * @returns
   */
  checkIn(employee_code: string): Observable<ApiResponse<AttendanceRecord>> {
    const url = `${this.apiUrl}/attendance-records/check-in/${employee_code}`;
    return this.httpClient.post<ApiResponse<AttendanceRecord>>(url, {});
  }

  /**
   * API check out attendance
   * @param employee_code
   * @param id id attendance record
   * @returns
   */
  checkOut(employee_code: string, id: number): Observable<ApiResponse<AttendanceRecord>> {
    const url = `${this.apiUrl}/attendance-records/check-out/${employee_code}/${id}`;
    return this.httpClient.post<ApiResponse<AttendanceRecord>>(url, {});
  }

  getMonthlySummary(employee_code: string): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/attendance-records/monthly-summary/${employee_code}`;
    return this.httpClient.get<ApiResponse<any>>(url);
  }

  getListAttendanceAdjustments(
    request: PageFilterRequest<AttendanceAdjustment>,
  ): Observable<PageResponse<AttendanceAdjustment[]>> {
    const url = `${this.apiUrl}/attendance-adjustments/search`;
    return this.httpClient.post<PageResponse<AttendanceAdjustment[]>>(url, request);
  }

  createAttendanceAdjustment(
    attendanceAdjustment: AttendanceAdjustment,
  ): Observable<ApiResponse<AttendanceAdjustment>> {
    const url = `${this.apiUrl}/attendance-adjustments/create`;
    return this.httpClient.post<ApiResponse<AttendanceAdjustment>>(url, attendanceAdjustment);
  }

  updateAttendanceAdjustment(
    id: number,
    attendanceAdjustment: AttendanceAdjustment,
  ): Observable<ApiResponse<AttendanceAdjustment>> {
    const url = `${this.apiUrl}/attendance-adjustments/update/${id}`;
    return this.httpClient.put<ApiResponse<AttendanceAdjustment>>(url, attendanceAdjustment);
  }

  deleteAttendanceAdjustment(id: number): Observable<any> {
    const url = `${this.apiUrl}/attendance-adjustments/delete/${id}`;
    return this.httpClient.delete(url);
  }

  approveAttendanceAdjustment(id: number, approvedBy: string): Observable<any> {
    const url = `${this.apiUrl}/attendance-adjustments/approve/${id}/${approvedBy}`;
    return this.httpClient.post(url, {});
  }

  rejectAttendanceAdjustment(id: number, rejectedBy: string): Observable<any> {
    const url = `${this.apiUrl}/attendance-adjustments/reject/${id}/${rejectedBy}`;
    return this.httpClient.post(url, {});
  }

  // OVERTIME REQUEST SERVICES
  getListOvertimeRequests(
    request: PageFilterRequest<OvertimeRequest>,
  ): Observable<PageResponse<OvertimeRequest[]>> {
    const url = `${this.apiUrl}/overtime-requests/search`;
    return this.httpClient.post<PageResponse<OvertimeRequest[]>>(url, request);
  }

  createOvertimeRequest(
    overtimeRequest: OvertimeRequest,
  ): Observable<ApiResponse<OvertimeRequest>> {
    const url = `${this.apiUrl}/overtime-requests/create`;
    return this.httpClient.post<ApiResponse<OvertimeRequest>>(url, overtimeRequest);
  }

  updateOvertimeRequest(
    id: number,
    overtimeRequest: OvertimeRequest,
  ): Observable<ApiResponse<OvertimeRequest>> {
    const url = `${this.apiUrl}/overtime-requests/update/${id}`;
    return this.httpClient.put<ApiResponse<OvertimeRequest>>(url, overtimeRequest);
  }

  deleteOvertimeRequest(id: number): Observable<any> {
    const url = `${this.apiUrl}/overtime-requests/delete/${id}`;
    return this.httpClient.delete(url);
  }

  approveOvertimeRequest(id: number, approvedBy: string): Observable<any> {
    const url = `${this.apiUrl}/overtime-requests/approve/${id}/${approvedBy}`;
    return this.httpClient.post(url, {});
  }

  rejectOvertimeRequest(id: number, rejectedBy: string): Observable<any> {
    const url = `${this.apiUrl}/overtime-requests/reject/${id}/${rejectedBy}`;
    return this.httpClient.post(url, {});
  }
}
