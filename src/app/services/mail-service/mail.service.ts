import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { MailSender } from '../../shared/models/mailSender.model';
import { Observable } from 'rxjs';
import { ApiResponse, PageFilterRequest, PageResponse } from '../../shared/models';
import { MailTemplate } from '../../shared/models/mailTeamplate.model';
import { MailAccount } from '../../shared/models/mailAccount.model';
@Injectable({
  providedIn: 'root',
})
export class MailService {
  private readonly API_URL: string = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  sendMail(request: MailSender): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post<ApiResponse<any>>(`${this.API_URL}/api/mail/send`, request, {
      headers,
    });
  }

  searchMailTemplates(
    request: PageFilterRequest<MailTemplate>,
  ): Observable<PageResponse<MailTemplate[]>> {
    return this.httpClient.post<PageResponse<MailTemplate[]>>(
      `${this.API_URL}/api/mail-templates/search`,
      request,
    );
  }

  searchMailAccounts(
    request: PageFilterRequest<MailAccount>,
  ): Observable<PageResponse<MailAccount[]>> {
    return this.httpClient.post<PageResponse<MailAccount[]>>(
      `${this.API_URL}/api/mail-accounts/search`,
      request,
    );
  }

  getMailAccountByUserLogin(username: string): Observable<ApiResponse<MailAccount>> {
    return this.httpClient.get<ApiResponse<MailAccount>>(
      `${this.API_URL}/api/mail-accounts/get-by-username/${username}`,
    );
  }
}
