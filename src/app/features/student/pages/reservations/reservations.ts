import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { ApiLoanService } from '../../../admin/pages/loans/apiLoan.service';
import { AuthService } from '../../../../core/guard/auth.service';
import { LoanState, ILoan } from '../../../admin/models/types';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-student-reservations',
    templateUrl: './reservations.html',
    styleUrl: './reservations.scss',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentReservationsComponent {
    private readonly apiListService = inject(ApiListService);
    private readonly apiLoanService = inject(ApiLoanService);
    private readonly authService = inject(AuthService);
    private readonly toastr = inject(ToastrService);

    readonly allLoans = this.apiListService.loansList;
    readonly user = this.authService.user();

    readonly myReservations = computed(() => {
        return this.allLoans().filter(
            (loan) => loan.userId === this.user.id && loan.state === LoanState.RESERVATED,
        );
    });

    constructor() {
        this.apiListService.loadLoanList();
    }

    async cancelReservation(reservation: ILoan) {
        const response = await this.apiLoanService.delete(reservation.id);
        if (response.status === 'success') {
            this.apiListService.loansList.update((list) =>
                list.filter((l) => l.id !== reservation.id),
            );

            this.apiListService.bookTitleList.update((list) =>
                list.map((title) => {
                    if (title.id === reservation.book?.titleId) {
                        return {
                            ...title,
                            copies: title.copies?.map((c) =>
                                c.id === reservation.bookId ? { ...c, isAvailable: true } : c,
                            ),
                        };
                    }
                    return title;
                }),
            );
        }
    }
}
