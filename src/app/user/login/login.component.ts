import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  alertColor = 'blue';
  alertMessage = 'Please wait! We are logging you in.';
  showAlert = false;
  inSubmission = false;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });
  constructor(private auth: Auth) {}

  ngOnInit(): void {}

  async login() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.email.value!,
        this.password.value!
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
