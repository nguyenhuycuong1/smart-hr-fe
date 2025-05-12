import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UpdateInfoEmployeeService {
  private readonly API_URL: string = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  updateBankInfo(id: number, request: any): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/api/bank-info/${id}`, request);
  }

  createOrUpdateBankInfo(request: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/api/bank-info/create-or-update`, request);
  }
}
