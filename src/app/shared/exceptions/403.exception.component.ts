import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-403-exception',
  templateUrl: './403.exception.component.html',
  standalone: false,
})
export class ForbiddenExceptionComponent {
  constructor(private router: Router) {}

  backHome(): void {
    this.router.navigate(['/']);
  }
}
