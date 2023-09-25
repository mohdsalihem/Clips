import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
import IUser from 'src/app/models/user.model';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
  standalone: true,
  imports: [NgIf, AlertComponent, ReactiveFormsModule, InputComponent],
})
export class RegisterComponent implements OnInit {
  auth = inject(AuthService);
  emailTaken = inject(EmailTaken);

  inSubmission = false;
  showAlert = false;
  alertMessage = 'Please wait! Your account is being created.';
  alertColor = 'blue';

  ngOnInit(): void {}

  registerForm = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailTaken.validate],
      }),
      age: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(18),
          Validators.max(90),
        ],
      }),
      //at least 8 characters, 1 uppercase, 1 lowercase, and 1 number
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          ),
        ],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
    },
    [RegisterValidators.match('password', 'confirmPassword')],
  );

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      const userData = {
        ...this.registerForm.value,
        age: Number(this.registerForm.controls.age.value),
      } as IUser;

      await this.auth.createUser(userData);
    } catch (error) {
      this.alertMessage =
        'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMessage = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
