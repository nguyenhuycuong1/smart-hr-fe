import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BaseService } from './services/app-service/base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {

  constructor(private keycloak: KeycloakService, private baseService: BaseService) {}

  ngOnInit() {
    this.baseService.getInfoBusiness().subscribe({
      next: (res) => {
        this.infoBusiness = res.data;
      },
      error: (error) => {
        console.log(error); 
      }
    });
  }

  logout() {
    this.keycloak.logout();
  }

  infoBusiness: any;
}
