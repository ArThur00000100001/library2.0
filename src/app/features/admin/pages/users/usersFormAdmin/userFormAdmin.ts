import { Component, ChangeDetectionStrategy, inject, model } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usersForm-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title h4 fw-bold text-white">
          <span class="accent-line"></span>

          {{
            mode() === 'create'
              ? 'Registrar'
              : mode() === 'edit'
                ? 'Editar'
                : 'Importar'
          }}

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

        <form class="row g-3">
          <!-- Full Name -->
          <div class="col-12">
            <label class="form-label text-light small fw-semibold">Nombre Completo</label>
            <div class="input-group-custom">
              <input type="text" class="form-control-custom" placeholder="Ej. Juan Andrés" />
            </div>
          </div>

          <!-- Last Names -->
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Apellido Paterno</label>
            <input type="text" class="form-control-custom" placeholder="Pérez" />
          </div>
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Apellido Materno</label>
            <input type="text" class="form-control-custom" placeholder="García" />
          </div>

          <!-- Email & DNI -->
          <div class="col-md-7">
            <label class="form-label text-light small fw-semibold">Correo Electrónico</label>
            <input type="email" class="form-control-custom" placeholder="juan.pg@ejemplo.com" />
          </div>
          <div class="col-md-5">
            <label class="form-label text-light small fw-semibold">DNI / Documento</label>
            <input type="text" class="form-control-custom" placeholder="8 dígitos" />
          </div>

          <!-- Password & Role -->
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Contraseña</label>
            <input type="password" class="form-control-custom" placeholder="••••••••" />
          </div>
          <div class="col-md-6">
            <label class="form-label text-light small fw-semibold">Rol de Usuario</label>
            <select class="form-select-custom">
              <option value="student">Estudiante</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn-cancel" (click)="modalActivate?.close()">Cancelar</button>
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
})
export class UsersFormComponent {
  readonly modalActivate = inject(NgbActiveModal, { optional: true });

  readonly mode = model<'create' | 'edit' | 'import'>('create');
}
