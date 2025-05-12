import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { AccountUser } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private readonly API_URL: string = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  /**
   *
   */
  getInfoUserAccount(userId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/api/users/${userId}`);
  }
}
