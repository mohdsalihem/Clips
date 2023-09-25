import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  standalone: true,
  imports: [NavComponent, RouterOutlet, NgIf, AuthModalComponent, AsyncPipe],
})
export class AppComponent {
  auth = inject(AuthService);
}
