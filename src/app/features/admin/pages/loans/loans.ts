import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { ILoan, LoanState } from '../../models/types';
import { ApiLoanService } from './apiLoan.service';
import { CopyTitlesApiService } from '../title-books/books/apiCopyTitles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanFormComponent } from './LoanFormAdmin/LoanFormAdmin';

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

    readonly apiLoanService = inject(ApiLoanService);
    readonly copyBookApiService = inject(CopyTitlesApiService);
    readonly apiListservice = inject(ApiListService);
    readonly modalService = inject(NgbModal);

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
    async formLoan(mode: 'create' | 'edit', data: ILoan | null = null) {
        const ref = this.modalService.open(LoanFormComponent, {
            size: 'lg',
            backdrop: 'static',
        });

        const component: LoanFormComponent = ref.componentInstance;
        component.mode.set(mode);
        if (data) component.loan.set(data);

        const result = await ref.result;
        if (result) {
            this.apiListservice.loadLoanList();
        }
    }

    // Método para procesar la devolucion de un libro
    async returnBook(loan: ILoan) {
        const response = await this.apiLoanService.edit(loan.id, {
            returnDate: new Date().toISOString().split('T')[0],
            state: this.loanState.RETURNED,
        });
        const response2 = await this.copyBookApiService.edit(loan.book?.id!, {
            isAvailable: true,
        });

        if (response.status == 'failure') return;
        this.loansList.update((loan) =>
            loan.map((x) => (x.id === response.data.id ? response.data : x)),
        );
    }

    // Método para eliminar un registro de préstamo
    eliminate(id: number) {
        console.log('Eliminar préstamo:', id);
    }
}
