import { Component, OnInit, inject } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { destroyNotifier } from '../helpers/destroyNotifier';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styles: [],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class NavComponent implements OnInit {
  modal = inject(ModalService);
  auth = inject(AuthService);
  router = inject(Router);

  destroy$ = destroyNotifier();

  ngOnInit(): void {
    this.checkAuth();
  }

  openModal() {
    this.modal.toggleModal();
  }

  async logout() {
    await this.auth.logout();
    localStorage.removeItem('isAuthenticated');
    await this.router.navigate(['/']);
  }
  checkAuth() {
    this.auth.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) =>
        localStorage.setItem('isAuthenticated', String(response)),
      );
  }
  isAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      return false;
    }
    return isAuthenticated === 'true';
  }
}
