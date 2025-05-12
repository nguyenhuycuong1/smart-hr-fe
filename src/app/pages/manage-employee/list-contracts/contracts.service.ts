import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { PageFilterRequest } from '../../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private readonly API_URL = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  /**
   * Api lấy danh sách hợp đồng với page filter
   * @param request
   * @returns
   */
  getListContracts(request: PageFilterRequest<any>): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/api/contracts/search`, request);
  }

  /**
   * Api tạo hợp đồng mới
   * @param request
   * @returns
   */
  createContract(request: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/api/contracts/create`, request);
  }

  /**
   * Api lấy thông tin hợp đồng theo mã hợp đồng
   * @param contractCode
   * @returns
   */
  updateContract(request: any): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/api/contracts/update`, request);
  }

  /**
   * Api xoó hợp đồng theo mã hợp đồng
   * @param contractCode
   * @returns
   */
  deleteContract(contractCode: string): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}/api/contracts/${contractCode}`);
  }
}
