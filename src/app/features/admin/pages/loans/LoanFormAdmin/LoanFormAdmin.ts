import {
    Component,
    ChangeDetectionStrategy,
    inject,
    model,
    signal,
    OnInit,
    computed,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { apiUserService } from '../../users/apiUser.service';
import { CopyTitlesApiService } from '../../title-books/books/apiCopyTitles.service';
import { ApiLoanService } from '../apiLoan.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IBook, ILoan, IUser, LoanState } from '../../../models/types';
import { ApiListService } from '../../../../services/contentList/api-list.service';

type formLoan = {
    bookId: FormControl<number | null>;
    userId: FormControl<number | null>;
    dueDate: FormControl<string | null>;
};

@Component({
    selector: 'app-loan-form-admin',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './LoanFormAdmin.html',
    styleUrl: './LoanFormAdmin.scss',
    imports: [ReactiveFormsModule],
})
export class LoanFormComponent implements OnInit {
    readonly modalActivate = inject(NgbActiveModal, { optional: true });
    readonly apiUserService = inject(apiUserService);
    readonly apiBookService = inject(CopyTitlesApiService);
    readonly apiLoanService = inject(ApiLoanService);

    readonly apiListService = inject(ApiListService);

    readonly mode = model<'create' | 'edit'>('create');
    readonly loan = model<ILoan | null>(null);

    readonly usersList = this.apiListService.usersList;
    readonly booksList = this.apiListService.copyBookList;

    readonly formData = new FormGroup<formLoan>({
        bookId: new FormControl(null, [Validators.required]),
        userId: new FormControl(null, [Validators.required]),
        dueDate: new FormControl(null, [Validators.required]),
    });

    async ngOnInit() {
        this.apiListService.loadCopyBookList();
        this.apiListService.loadUserNeeded();

        const users = this.usersList();
        const books = this.booksList();
        console.log('user', users, 'book', books);
        this.usersList.set(users.filter((u) => u.role === 'student'));
        if (this.mode() === 'edit' && this.loan()) {
            this.booksList.set(books);
            const loanData = this.loan()!;
            this.formData.patchValue({
                bookId: loanData.bookId,
                userId: loanData.userId,
                dueDate: loanData.dueDate ? loanData.dueDate.split('T')[0] : null,
            });
        } else {
            this.booksList.set(books.filter((b) => b.isAvailable));
        }
    }

    async submitData() {
        if (this.formData.invalid) {
            this.formData.markAllAsTouched();
            return;
        }

        if (this.mode() === 'create') {
            await this.create();
        } else {
            await this.edit();
        }
    }

    async create() {
        const data = this.formData.value;
        const body: Partial<ILoan> = {
            bookId: data.bookId!,
            userId: data.userId!,
            dueDate: data.dueDate!,
            loanDate: new Date().toISOString().split('T')[0],
            state: LoanState.LOANED,
        };

        const response = await this.apiLoanService.create(body);
        if (response.status === 'success') {
            await this.apiBookService.edit(data.bookId!, { isAvailable: false });
            this.modalActivate?.close(response.data);
        }
    }

    async edit() {
        if (!this.loan()) return;
        const data = this.formData.value;
        const body: Partial<ILoan> = {
            bookId: data.bookId!,
            userId: data.userId!,
            dueDate: data.dueDate!,
        };
        const response = await this.apiLoanService.edit(this.loan()!.id, body);
        if (response.status === 'success') {
            this.modalActivate?.close(response.data);
        }
    }
}
