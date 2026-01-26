import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiFetchService } from '../../services/apiFetch.service';
import { API } from '../../environment/environment';
import { AuthService } from '../../../core/guard/auth.service';
import { ValidateLastWord } from '../../functions/Validators/validatorsFunctions';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  readonly apiFetchService = inject(ApiFetchService);
  readonly authService = inject(AuthService)
  readonly router = inject(Router)

  readonly credentialErrorMessage = signal<string>('')

  formData = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      //ValidateLastWord('@gmail.com'),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16),
    ]),
  });

  async onSubmit() {
    this.formData.markAllAsTouched();
    if (this.formData.invalid) return;

    const bodyDataFetch = this.formData.value;
    const response = await this.apiFetchService.postApi(`${API}/auth/login`, bodyDataFetch);

    if(response.status !== 'success'){
      this.credentialErrorMessage.set('Email o contraseña incorrectas')
    }

    const data = response.data
    localStorage.setItem('token-raw', JSON.stringify(data))

    this.authService.token.set(data.access_token)
    this.authService.user.set(data.user)

    if(data.user.role == 'admin')
      this.router.navigate(['/admin'])
    if(data.user.role == 'student')
      this.router.navigate(['/student'])

  }

  
}
