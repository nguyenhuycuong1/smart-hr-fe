import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { initializer } from './app-init';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { TokenInterceptor } from './services/interceptors/token-interceptor';
// import { MainLayoutModule } from './shared/layout/main-layout/main-layout.module';
import { StoreModule } from '@ngrx/store';
import { breadcrumbReducer } from './store/breadcrumb.reducer';
import { ComponentsModule } from './shared/components/components.module';
provideHttpClient(withInterceptorsFromDi()), registerLocaleData(en);

import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    KeycloakAngularModule,
    ComponentsModule,
    StoreModule.forRoot({ breadcrumbs: breadcrumbReducer }),
    NgxSummernoteModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
