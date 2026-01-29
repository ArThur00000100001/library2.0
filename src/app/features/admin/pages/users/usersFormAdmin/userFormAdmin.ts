import { Component, ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
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
import { IUser } from '../../../models/types';

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
    templateUrl: './userFormAdmin.html',
    styleUrl: './userFormAdmin.scss',
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
            password: this.user()?.password,
            role: this.user()?.role,
        });
    }

    async submitData() {
        if (this.checkValidations()) return;
        if (this.mode() == 'create') await this.create();
        if (this.mode() == 'edit') await this.edit();
    }

    async create() {
        const response = await this.apiUserService.create(this.formData.value);
        if (response.status == 'success') this.modalActivate?.close(response.data);

        localStorage.setItem('today', String(new Date()));
    }
    async edit() {
        const { dni, ...data } = this.formData.value;
        console.log(data);
        const response = await this.apiUserService.edit(this.user()?.id!, data);

        if (response.status == 'success') this.modalActivate?.close(response.data);
    }

    checkValidations(): boolean {
        if (this.mode() == 'edit') {
            this.formData.get('password')?.clearValidators();
            this.formData.get('dni')?.clearValidators();
        }

        this.formData.markAllAsTouched();
        if (this.formData.invalid) return true;
        return false;
    }
}
