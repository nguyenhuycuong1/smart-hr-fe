import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { map, Observable, firstValueFrom } from 'rxjs';
import { AccountUser } from '../../shared/models';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private readonly API_URL: string = environment.api_endpoint;
  constructor(
    private httpClient: HttpClient,
    private keycloak: KeycloakService,
    private router: Router,
  ) {}

  /**
   *
   */
  getInfoUserAccount(userId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/api/users/${userId}`);
  }

  getCurrentUserAccount(): Observable<AccountUser> {
    const userId = this.keycloak.getKeycloakInstance().profile?.id;
    if (userId) {
      return this.getInfoUserAccount(userId);
    } else {
      throw new Error('User ID not found');
    }
  }

  async getFullNameCurrentUser() {
    return await this.keycloak.loadUserProfile().then((profile) => {
      return profile.lastName + ' ' + profile.firstName;
    });
  }

  getCurrentEmployeeCodeInAccount(): Observable<string> {
    return this.getCurrentUserAccount().pipe(
      map((res: any) => {
        return res.data.attributes?.employeeCode?.[0] || '';
      }),
    );
  }

  async checkRoleAuthorization(list_roles: string[]) {
    const userRoles = await this.keycloak.getUserRoles();
    return (
      userRoles.includes('admin_business') || list_roles.some((role) => userRoles.includes(role))
    );
  }

  /**
   * Checks if the provided employee code matches the current user's employee code
   * Redirects to 403 exception page if they don't match
   * Allows users with 'admin_business' role or any role from list_roles to bypass this check
   * @param employee_code The employee code to check
   * @param list_roles Optional array of roles that can bypass the check
   * @returns Promise that resolves when the check is complete
   */
  async checkEmployeeCodeAuthorization(
    employee_code: string,
    list_roles?: string[],
  ): Promise<void> {
    try {
      // Check if user has admin_business role or any role from list_roles
      const userRoles = await this.keycloak.getUserRoles();
      if (
        userRoles.includes('admin_business') ||
        (list_roles && list_roles.some((role) => userRoles.includes(role)))
      ) {
        return; // Skip the employee code check and allow access
      }

      // Continue with normal employee code check
      const currentEmployeeCode = await firstValueFrom(this.getCurrentEmployeeCodeInAccount());
      if (employee_code !== currentEmployeeCode) {
        this.router.navigate(['/403']);
      }
    } catch (error) {
      console.error('Error checking employee code authorization:', error);
      this.router.navigate(['/403']);
    }
  }
}
