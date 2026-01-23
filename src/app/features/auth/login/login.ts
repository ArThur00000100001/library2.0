import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [ReactiveFormsModule, RouterLinkActive]
})
export class LoginComponent {
  formData = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.ValidateLastWord('gmail.com'),
      Validators.maxLength(50)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16),
    ]),
  });

  onSubmit(){
    this.formData.markAllAsTouched()
    if(this.formData.invalid) return

    
  }

  //Validacion personalizada - retorna true si en caso la ultima parabra no coincide
  ValidateLastWord(lastWord: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valueControl = control.value;
      return valueControl.endsWith(lastWord) ? null : { lastWord: true };
    };
  }
}
