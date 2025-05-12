import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private keyCloak: KeycloakService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const lstRoles: string[] = this.keyCloak.getUserRoles();

    if (lstRoles && lstRoles.length > 0) {
      const requiredRole = route.data['requiredRole'];
      if (this.checkRoles(requiredRole, lstRoles)) {
        return true;
      } else {
        return this.router.createUrlTree(['/403']);
      }
    } else {
      return this.router.createUrlTree(['/403']);
    }
  }

  checkRoles(rolesToCheck: string[], roles: string[]): boolean {
    if (roles.includes('admin_business')) {
      return true;
    }
    return rolesToCheck.some((role) => roles.includes(role));
  }
}
