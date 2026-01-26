import { Component, ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  FormGroup,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ValidateLastWord } from '../../../../functions/Validators/validatorsFunctions';
import { IUser } from '../../../models/types';
import { BooksTitlesApiService } from '../apiBookTitles.service';

type IFormBookTitle = {
  title: FormControl<string | null>;
  author: FormControl<string | null>;
  publicationYear: FormControl<string | null>;
  isbn: FormControl<string | null>;
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
  readonly apiBookTitleService = inject(BooksTitlesApiService);

  readonly mode = model<'create' | 'edit' | 'import'>('create');
  readonly user = model<IUser | null>(null);

  readonly formData = new FormGroup<IFormBookTitle>({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
    ]),
    author: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    publicationYear: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    isbn: new FormControl(null, [
      Validators.required,
      Validators.email,
      ValidateLastWord('@gmail.com'),
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
  });

  ngOnInit() {
    if (!(this.mode() == 'edit' && this.user() != null)) return;
    this.formData.get('password')?.clearValidators();

    this.formData.patchValue({
      title: this.user()?.fullName,
      author: this.user()?.firstLastName,
      publicationYear: this.user()?.secondLastName,
      isbn: this.user()?.email,
    });
  }

  async submitData() {
    this.formData.markAllAsTouched();
    if (this.formData.invalid) return;

    // if (this.mode() == 'create') await this.create();
    // if (this.mode() == 'edit') await this.edit();
  }

  // async create() {
  //   const response = await this.apiBookTitleService.create(this.formData.value);
  //   if ((response.status = 'success')) this.modalActivate?.close(response.data);
  // }
  // async edit() {
  //   //const {password, ...data} = this.formData.value
  //   const response = await this.apiBookTitleService.edit(this.user()?.id!, this.formData.value);
  //   if ((response.status = 'success')) this.modalActivate?.close(response.data);
  // }
}
