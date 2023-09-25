import { Auth, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { delay, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: Auth) {}

  validate = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    const isEmailExist$ = of(control.value).pipe(
      delay(1000),
      switchMap((email) =>
        fetchSignInMethodsForEmail(this.auth, email).then((response) =>
          response.length ? { emailTaken: true } : null
        )
      )
    );
    return isEmailExist$;
  };
}
