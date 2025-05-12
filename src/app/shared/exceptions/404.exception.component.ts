import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-404-exception',
  templateUrl: './404.exception.component.html',
  standalone: false,
})
export class NotFoundExceptionComponent {
  constructor(private router: Router) {}

  backHome(): void {
    this.router.navigate(['/']);
  }
}
