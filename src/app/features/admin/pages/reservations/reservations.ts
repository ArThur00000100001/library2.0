import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { ApiLoanService } from '../loans/apiLoan.service';
import { CopyTitlesApiService } from '../title-books/books/apiCopyTitles.service';
import { LoanState, ILoan } from '../../models/types';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-reservations',
    templateUrl: './reservations.html',
    styleUrl: './reservations.scss',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservationsComponent {
    private readonly apiListService = inject(ApiListService);
    private readonly apiLoanService = inject(ApiLoanService);
    private readonly apiCopyService = inject(CopyTitlesApiService);
    private readonly toastr = inject(ToastrService);

    readonly allLoans = this.apiListService.loansList;

    readonly pendingReservations = computed(() => {
        return this.allLoans().filter(loan => loan.state === LoanState.RESERVATED);
    });

    constructor() {
        this.apiListService.loadLoanList();
        // Also ensure book titles are loaded to show book details if needed
        this.apiListService.loadBookTitlesList();
    }

    async acceptReservation(reservation: ILoan) {
        // When accepting, we set the loan date to now and set a due date for 7 days from now
        const now = new Date();
        const dueDate = new Date();
        dueDate.setDate(now.getDate() + 7);

        const updateData: Partial<ILoan> = {
            state: LoanState.LOANED,
            loanDate: now.toISOString(),
            dueDate: dueDate.toISOString(),
        };

        const response = await this.apiLoanService.edit(reservation.id, updateData);
        if (response.status === 'success') {
            this.apiListService.loansList.update(list => 
                list.map(l => l.id === reservation.id ? { ...l, ...updateData } : l)
            );
            this.toastr.success('Reservación aceptada. El libro ahora está marcado como prestado.', 'Éxito');
        }
    }

    async rejectReservation(reservation: ILoan) {
        if (!confirm('¿Estás seguro de que deseas rechazar esta reservación? El libro volverá a estar disponible.')) return;

        // 1. Delete the reservation record
        const response = await this.apiLoanService.delete(reservation.id);
        if (response.status === 'success') {
            // 2. Mark the book as available again
            if (reservation.bookId) {
                await this.apiCopyService.edit(reservation.bookId, { isAvailable: true });
            }

            // 3. Update local state
            this.apiListService.loansList.update(list => list.filter(l => l.id !== reservation.id));
            
            // 4. Update local book titles list to show it's available again
            this.apiListService.bookTitleList.update(list => 
                list.map(title => ({
                    ...title,
                    copies: title.copies?.map(copy => 
                        copy.id === reservation.bookId ? { ...copy, isAvailable: true } : copy
                    )
                }))
            );

            this.toastr.info('Reservación rechazada y libro liberado.', 'Información');
        }
    }
}
