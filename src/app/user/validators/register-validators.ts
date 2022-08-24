import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        console.error('Form controls not found in form group');
        return { controlNotFound: true };
      }

      if (control.value === matchingControl.value) {
        return null;
      }

      const error = { notMatch: true };
      matchingControl.setErrors(error);
      return error;
    };
  }
}
