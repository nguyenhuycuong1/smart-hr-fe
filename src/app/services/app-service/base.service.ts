import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  url: string = environment.api_endpoint;

  constructor(private httpClient: HttpClient, private keycloakService: KeycloakService) {}

  /**
   * Api lấy thông tin doanh nghiệp
   * @returns
   */
  getInfoBusiness(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/api/tenant`);
  }

  checkAuthentication(listRole: string[]) {
    if (listRole === null || listRole.length == 0) {
      return true;
    }
    return listRole.some((role: string) => {
      return this.keycloakService.isUserInRole(role);
    });
  }

  /**
   * Hàm kiểm tra tài khoản có quyền để thực hiện action hay không
   * @param roles các quyền cần kiểm tra trong danh sách quyền của tài khoản
   * @returns
   */
  isCheckRoles(roles: any) {
    if (this.checkAuthentication(['admin_business'])) {
      return true;
    } else {
      return this.checkAuthentication(roles);
    }
  }
}
