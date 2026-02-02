import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { AuthService } from '../../../../core/guard/auth.service';
import { LoanState } from '../../../admin/models/types';

@Component({
    selector: 'app-student-loans',
    templateUrl: './loans.html',
    styleUrl: './loans.scss',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentLoansComponent {
    private readonly apiListService = inject(ApiListService);
    private readonly authService = inject(AuthService);

    readonly allLoans = this.apiListService.loansList;
    readonly user = this.authService.user();

    readonly myLoans = computed(() => {
        return this.allLoans().filter(loan => 
            loan.userId === this.user.id && 
            (loan.state === LoanState.LOANED || loan.state === LoanState.RETURNED)
        );
    });

    constructor() {
        this.apiListService.loadLoanList();
    }

    getStateName(state: LoanState): string {
        switch (state) {
            case LoanState.LOANED: return 'En préstamo';
            case LoanState.RETURNED: return 'Devuelto';
            default: return 'Desconocido';
        }
    }

    getStateClass(state: LoanState): string {
        switch (state) {
            case LoanState.LOANED: return 'bg-warning text-dark';
            case LoanState.RETURNED: return 'bg-success';
            default: return 'bg-secondary';
        }
    }
}
