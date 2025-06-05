import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private url: string = environment.api_endpoint + '/api/dashboard';
  constructor(private httpClient: HttpClient) {}

  getPersonnelData(range: Date[] | string[]): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(`${this.url}/personnel/${range[0]}/${range[1]}`);
  }

  getAttendanceAndLeaveData(range: Date[] | string[]): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${this.url}/attendance-and-leave/${range[0]}/${range[1]}`,
    );
  }
}
