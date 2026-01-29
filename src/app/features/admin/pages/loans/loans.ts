import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { LoanState } from '../../models/types';

@Component({
    selector: 'app-loans',
    templateUrl: './loans.html',
    styleUrl: './loans.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansComponent {
    constructor() {
        this.apiListservice.loadLoanList();
    }

    readonly apiListservice = inject(ApiListService);
    readonly loanState = LoanState;

    readonly loansList = this.apiListservice.loansList;

    readonly totalLoans = computed(() => {
        const loans = this.loansList();
        let total = 0;
        loans.forEach((x) => {
            x.state == this.loanState.LOANED ? total++ : null;
        });
        return total;
    });

    // Método para abrir el formulario de préstamos
    formLoan(mode: 'create' | 'edit', data: any = null) {
        console.log(`Abrir formulario en modo ${mode}`, data);
    }

    // Método para procesar la devolución de un libro
    returnBook(loan: any) {
        console.log('Procesar devolución:', loan);
    }

    // Método para eliminar un registro de préstamo
    eliminate(id: number) {
        console.log('Eliminar préstamo:', id);
    }
}
