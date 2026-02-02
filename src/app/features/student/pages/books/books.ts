import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { ApiLoanService } from '../../../admin/pages/loans/apiLoan.service';
import { AuthService } from '../../../../core/guard/auth.service';
import { IBook, IBookTitle, LoanState } from '../../../admin/models/types';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-student-books',
    templateUrl: './books.html',
    styleUrl: './books.scss',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentBooksComponent {
    private readonly apiListService = inject(ApiListService);
    private readonly apiLoanService = inject(ApiLoanService);
    private readonly authService = inject(AuthService);
    private readonly toastr = inject(ToastrService);

    readonly bookTitleList = this.apiListService.bookTitleList;
    readonly user = this.authService.user();

    // Only show books that have available copies
    readonly availableBooks = computed(() => {
        return this.bookTitleList()
            .map((title) => ({
                ...title,
                copies: title.copies?.filter((copy) => copy.isAvailable) || [],
            }))
            .filter((title) => title.copies.length > 0);
    });

    constructor() {
        this.apiListService.loadBookTitlesList();
    }

    async reserveBook(book: IBook) {
        if (!this.user.id) return;

        const reservation = {
            bookId: book.id,
            userId: this.user.id,
            state: LoanState.RESERVATED,
            loanDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        const response = await this.apiLoanService.create(reservation);
        if (response.status === 'success') {
            this.apiListService.bookTitleList.update((list) =>
                list.map((title) => {
                    if (title.id === book.titleId) {
                        return {
                            ...title,
                            copies: title.copies?.map((c) =>
                                c.id === book.id ? { ...c, isAvailable: false } : c,
                            ),
                        };
                    }
                    return title;
                }),
            );
        }
    }
}
