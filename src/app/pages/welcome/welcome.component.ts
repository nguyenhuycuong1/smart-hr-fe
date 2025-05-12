import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Breadcrumb } from '../../shared/models';
import { Store } from '@ngrx/store';
import { updateBreadcrumb } from '../../store/breadcrumbs.actions';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  breadcrumbs: Breadcrumb[] = [
      {title: 'Trang chủ', link: '/welcome'},
    ]
  constructor(private store: Store) {
    this.store.dispatch(updateBreadcrumb({breadcrumbs: this.breadcrumbs}))
  }

  ngOnDestroy() {
    this.store.dispatch(updateBreadcrumb({breadcrumbs: []}));
  }
}
