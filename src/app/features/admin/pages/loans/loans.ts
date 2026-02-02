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

    readonly searchTerm = signal('');
    readonly statusFilter = signal('');
    readonly dateFilter = signal('');

    readonly loansListFilter = computed(() => {
        let list = this.loansList();
        const search = this.searchTerm().toLowerCase();
        const status = this.statusFilter();
        const date = this.dateFilter();

        if (search) {
            list = list.filter(
                (l) =>
                    l.user?.fullName?.toLowerCase().includes(search) ||
                    l.book?.bookTitle?.title?.toLowerCase().includes(search) ||
                    l.userId.toString().includes(search),
            );
        }

        if (status) {
            if (status === 'active') {
                list = list.filter((l) => l.state === this.loanState.LOANED);
            } else if (status === 'returned') {
                list = list.filter((l) => l.state === this.loanState.RETURNED);
            }
            // 'overdue' logic would depend on dueDate compared to today
        }

        if (date) {
            const today = new Date().toISOString().split('T')[0];
            if (date === 'today') {
                list = list.filter((l) => l.loanDate === today);
            }
            // week/month logic could be added here
        }

        return list;
    });

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
        if (!result) return;
        mode == 'create' ? this.loansList.update((loans) => [result, ...loans]) : null;
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
