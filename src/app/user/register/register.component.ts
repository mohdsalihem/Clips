import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
import IUser from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  inSubmission = false;
  showAlert = false;
  alertMessage = 'Please wait! Your account is being created.';
  alertColor = 'blue';

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailTaken.validate]
  );
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);

  //at least 8 characters, 1 uppercase, 1 lowercase, and 1 number
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    ),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  ngOnInit(): void {}

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match('password', 'confirmPassword')]
  );

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      const userData: IUser = {
        name: this.name.value!,
        email: this.email.value!,
        age: parseInt(this.age.value!),
        phoneNumber: this.phoneNumber.value!,
        password: this.password.value!,
      };

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
