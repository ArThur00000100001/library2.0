import { Component, ChangeDetectionStrategy, inject, model } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { apiUserService } from '../apiUser.service';
import {
  FormControl,
  FormGroup,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ValidateLastWord } from '../../../../functions/Validators/validatorsFunctions';

type formUser = {
  fullName: FormControl<string | null>;
  firstLastName: FormControl<string | null>;
  secondLastName: FormControl<string | null>;
  email: FormControl<string | null>;
  dni: FormControl<string | null>;
  password: FormControl<string | null>;
  role: FormControl<'admin' | 'student' | null>;
};

@Component({
  selector: 'app-usersForm-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title h4 fw-bold text-white">
          <span class="accent-line"></span>

          {{ mode() === 'create' ? 'Registrar' : mode() === 'edit' ? 'Editar' : 'Importar' }}
        </h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          aria-label="Close"
          (click)="modalActivate?.close()"
        ></button>
      </div>

      <!-- Body -->
      <div class="modal-body py-4">
        <p class="text-secondary small mb-4">
          Completa la información detallada para registrar un nuevo usuario en la biblioteca.
        </p>

        <form class="row g-3" [formGroup]="formData" (ngSubmit)="create()">
          <!-- Full Name -->
          <div class="col-12">
            <label class="form-label text-light small fw-semibold">Nombre Completo</label>
            <div class="input-group-custom">
              <input
                type="text"
                class="form-control-custom"
                placeholder="Ej. Juan Andrés"
                formControlName="fullName"
              />
            </div>

            <label class="text-danger">
              @if (formData.get('fullName')?.touched) {
                @if (formData.get('fullName')?.errors?.['required']) {
                  Campo obligatorio
                }
                @if (
                  formData.get('fulName')?.errors?.['maxlength'] ||
                  formData.get('fullName')?.errors?.['minlength']
                ) {
                  Límite de carácteres (3-25)
                }
              }
            </label>
          </div>

          <!-- Last Names -->
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Apellido Paterno</label>
            <input
              type="text"
              class="form-control-custom"
              placeholder="Pérez"
              formControlName="firstLastName"
            />

            <label class="text-danger">
              @if (formData.get('firstLastName')?.touched) {
                @if (formData.get('firstLastName')?.errors?.['required']) {
                  Campo obligatorio
                }
                @if (
                  formData.get('firstLastName')?.errors?.['maxlength'] ||
                  formData.get('firstLastName')?.errors?.['minlength']
                ) {
                  Límite de carácteres (4-50)
                }
              }
            </label>
          </div>
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Apellido Materno</label>
            <input
              type="text"
              class="form-control-custom"
              placeholder="García"
              formControlName="secondLastName"
            />

            <label class="text-danger">
              @if (formData.get('secondLastName')?.touched) {
                @if (formData.get('secondLastName')?.errors?.['required']) {
                  Campo obligatorio
                }
                @if (
                  formData.get('secondLastName')?.errors?.['maxlength'] ||
                  formData.get('secondLastName')?.errors?.['minlength']
                ) {
                  Límite de carácteres (4-50)
                }
              }
            </label>
          </div>

          <!-- Email & DNI -->
          <div class="col-md-7">
            <label class="form-label text-light small fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              class="form-control-custom"
              placeholder="juan.pg@ejemplo.com"
              formControlName="email"
            />

            <label class="text-danger">
              @if (formData.get('email')?.touched) {
                @if (formData.get('email')?.errors?.['required']) {
                  Campo obligatorio
                }
                @if (
                  formData.get('email')?.errors?.['email'] ||
                  formData.get('email')?.errors?.['lastWord']
                ) {
                  Ingrese un email válido @gmail.com
                } @else if (
                  formData.get('email')?.errors?.['maxlength'] ||
                  formData.get('email')?.errors?.['minlength']
                ) {
                  Límite de carácteres (6-50)
                }
              }
            </label>
          </div>
          <div class="col-md-5">
            <label class="form-label text-light small fw-semibold">DNI / Documento</label>
            <input
              type="text"
              class="form-control-custom"
              placeholder="8 dígitos"
              formControlName="dni"
            />

            <label class="text-danger">
              @if (formData.get('dni')?.touched) {
                @if (formData.get('dni')?.errors?.['required']) {
                  Campo obligatorio
                }
                @if (
                  formData.get('dni')?.errors?.['maxlength'] ||
                  formData.get('dni')?.errors?.['minlength']
                ) {
                  Ingrese un dni Válido
                }
              }
            </label>
          </div>

          <!-- Password & Role -->
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Contraseña</label>
            <input
              type="password"
              class="form-control-custom"
              placeholder="••••••••"
              formControlName="password"
            />

            <label class="text-danger">
              @if (formData.get('password')?.touched) {
                @if (formData.get('password')?.errors?.['required']) {
                  Campo obligatorio
                }
                @if (
                  formData.get('password')?.errors?.['maxlength'] ||
                  formData.get('password')?.errors?.['minlength']
                ) {
                  Límite de carácteres (4-16)
                }
              }
            </label>
          </div>
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Rol de Usuario</label>
            <select class="form-select-custom" formControlName="role">
              <option value="student">Estudiante</option>
              <option value="admin">Administrador</option>
            </select>

            <label class="text-danger">
              @if (formData.get('secondLastName')?.touched) {
                @if (formData.get('secondLastName')?.errors?.['required']) {
                  Campo obligatorio
                }
              }
            </label>
          </div>

          <!-- Footer -->
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn-cancel" (click)="modalActivate?.close()">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              <span>Guardar Usuario</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="ms-2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: #1e293b;
        border-radius: 20px;
        color: #f8fafc;
      }

      .modal-container {
        padding: 1rem;
      }

      .accent-line {
        display: inline-block;
        width: 4px;
        height: 24px;
        background: #6366f1;
        margin-right: 12px;
        border-radius: 4px;
        vertical-align: middle;
      }

      .form-control-custom,
      .form-select-custom {
        width: 100%;
        padding: 0.75rem 1rem;
        background-color: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        color: white;
        transition: all 0.2s ease;
        outline: none;

        &::placeholder {
          color: #64748b;
        }

        &:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
      }

      .form-select-custom {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 16px 12px;
      }

      .btn-submit {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }
      }

      .btn-cancel {
        background: transparent;
        color: #94a3b8;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
      }
    `,
  ],
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
})
export class UsersFormComponent {
  readonly modalActivate = inject(NgbActiveModal, { optional: true });
  readonly apiUserService = inject(apiUserService);

  readonly mode = model<'create' | 'edit' | 'import'>('create');
  readonly user = model<IUser | null>(null);

  readonly formData = new FormGroup<formUser>({
    fullName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
    ]),
    firstLastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    secondLastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.email,
      ValidateLastWord('@gmail.com'),
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    dni: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16),
    ]),
    role: new FormControl('student', [Validators.required]),
  });

  ngOnInit() {
    if (!(this.mode() == 'edit' && this.user() != null)) return;
    this.formData.get('password')?.clearValidators();

    this.formData.patchValue({
      fullName: this.user()?.fullName,
      firstLastName: this.user()?.firstLastName,
      secondLastName: this.user()?.secondLastName,
      email: this.user()?.email,
      dni: this.user()?.dni,
      role: this.user()?.role,
    });
  }

  async submitData(){
    this.formData.markAllAsTouched()
    if(this.formData.invalid) return
    
    if(this.mode() == 'create') await this.create()
    //if(this.mode() == 'edit')
  }

  async create() {
    const response = await this.apiUserService.create(this.formData.value);
    if ((response.status = 'success')) this.modalActivate?.close(response.data);
  }
}
