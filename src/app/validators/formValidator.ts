import { FormControl, ValidationErrors } from "@angular/forms";

export class FormValidators {
  static notBlank(formControl: FormControl): ValidationErrors {
    if ((formControl.value != null) && (formControl.value.trim().length == 0)) {
      return { 'notBlank': true }
    } else {
      return null as any;
    }
  }
}