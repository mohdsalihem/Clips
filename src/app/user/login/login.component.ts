import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  standalone: true,
  imports: [NgIf, AlertComponent, ReactiveFormsModule, InputComponent],
})
export class LoginComponent implements OnInit {
  auth = inject(Auth);

  alertColor = 'blue';
  alertMessage = 'Please wait! We are logging you in.';
  showAlert = false;
  inSubmission = false;

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  ngOnInit(): void {}

  async login() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value,
      );
    } catch (error) {
      this.alertColor = 'red';
      this.alertMessage = 'Incorrect email or password';
      this.inSubmission = false;
      return;
    }

    this.alertColor = 'green';
    this.alertMessage = 'Success! You are now logged in.';
  }
}
