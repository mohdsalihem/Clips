import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';

@NgModule({
    imports: [CommonModule, SharedModule, ReactiveFormsModule, AuthModalComponent, LoginComponent, RegisterComponent],
    exports: [AuthModalComponent],
})
export class UserModule {}
