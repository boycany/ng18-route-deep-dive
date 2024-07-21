import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  private router = inject(Router);
  constructor() {
    timer(3000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
