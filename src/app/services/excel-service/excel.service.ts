import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Employee, PageFilterRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private readonly url = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  exportExcelEmployeeData(pageFilter: PageFilterRequest<Employee>) {
    return this.httpClient.post(`${this.url}/api/employees/export-excel`, pageFilter, {
      responseType: 'blob',
    });
  }

  exportExcelContractData(pageFilter: PageFilterRequest<any>) {
    return this.httpClient.post(`${this.url}/api/contracts/export-excel`, pageFilter, {
      responseType: 'blob',
    });
  }
}
