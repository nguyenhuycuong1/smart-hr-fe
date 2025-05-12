import { Component, Input } from '@angular/core';
import { Breadcrumb } from '../../models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'shr-breadcrumb',
  standalone: false,
  templateUrl: './shr-breadcrumb.component.html',
  styleUrl: './shr-breadcrumb.component.scss',
})
export class ShrBreadcrumbComponent {
  @Input() listBreadcrumb: Breadcrumb[] | null = [];

  constructor(private router: Router) {}

  handleRedirect(path: string) {
    this.router.navigate([path]);
  }
}
