import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BaseService } from './services/app-service/base.service';
import { ThemeService } from './services/theme-service/theme.service.fixed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private keycloak: KeycloakService,
    private baseService: BaseService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.baseService.getInfoBusiness().subscribe({
      next: (res) => {
        this.infoBusiness = res.data;
        this.initializeTheme();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private initializeTheme() {
    // Đầu tiên sử dụng màu mặc định từ localStorage nếu có
    const savedColor = localStorage.getItem('business_color');
    if (savedColor) {
      this.themeService.changePrimaryColor(savedColor);
    }

    // Lưu màu mới vào localStorage
    localStorage.setItem('business_color', this.infoBusiness.primary_color);
    // Áp dụng màu mới
    this.themeService.changePrimaryColor(this.infoBusiness.primary_color);
  }

  logout() {
    this.keycloak.logout();
  }

  infoBusiness: any;
}
