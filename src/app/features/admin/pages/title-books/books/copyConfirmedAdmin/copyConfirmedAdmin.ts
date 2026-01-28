import { Component, ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FormControl,
    FormGroup,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { ValidateLastWord } from '../../../../../functions/Validators/validatorsFunctions';
import { IBookTitle, IUser } from '../../../../models/types';
import { CopyTitlesApiService } from '../apiCopyTitles.service';

@Component({
    selector: 'app-usersForm-admin',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './bookTitleFormAdmin.html',
    styleUrl: './bookTitleFormAdmin.scss',
    imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
})
export class CopyConfirmedModal {
    readonly modalActivate = inject(NgbActiveModal, { optional: true });
    readonly apiBookTitleService = inject(CopyTitlesApiService);

    readonly bookTitle = model<IBookTitle | null>(null);

    readonly formData = new FormGroup({
        copyNumber: new FormControl(),
    });

    ngOnInit() {
        this.formData.get('copyNumber')?.setValue(this.bookTitle()?.copies?.length! + 1);
    }

    constructor() {
        console.log(this.bookTitle());
    }

    async create() {
        this.formData.markAllAsTouched();
        if (!this.formData.valid) return;
        const response = await this.apiBookTitleService.create({
            titleId: this.bookTitle()?.id,
            copyNumber: +this.formData.get('copyNumber')?.value,
            isAvailable: true,
        });
        if (response.status == 'success') this.modalActivate?.close(response.data);
    }
}
