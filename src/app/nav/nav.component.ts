import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styles: [],
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgIf,
    ],
})
export class NavComponent implements OnInit {
  constructor(public modal: ModalService, private auth: AuthService) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal();
  }

  async logout($event: Event) {
    $event.preventDefault();
    await this.auth.logout();
  }
  checkAuth() {
    this.auth.isAuthenticated$.subscribe((response) =>
      localStorage.setItem('isAuthenticated', String(response))
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
