import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { TabComponent } from '../../shared/tab/tab.component';
import { TabsContainerComponent } from '../../shared/tabs-container/tabs-container.component';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styles: [],
  standalone: true,
  imports: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    LoginComponent,
    RegisterComponent,
  ],
})
export class AuthModalComponent implements OnInit {
  ngOnInit(): void {}
}
