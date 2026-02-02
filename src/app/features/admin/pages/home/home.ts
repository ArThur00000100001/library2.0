import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { LoanState } from '../../models/types';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    styleUrl: './home.scss',
    imports: [RouterLink],
})
export class HomeComponent {
    constructor() {
        this.apiListService.loadBookTitlesList();
        this.apiListService.loadLoanList();
    }

    readonly apiListService = inject(ApiListService);
    readonly loanState = LoanState;

    readonly userList = this.apiListService.usersList;
    readonly newUsers = this.apiListService.newUsers;
    readonly bookTitlesList = this.apiListService.bookTitleList;
    readonly loanList = this.apiListService.loansList;
    readonly newLoans = this.apiListService.newLoans;

    readonly totalLoans = computed(() => {
        const list = this.loanList();
        let total = 0;
        list.forEach((x) => {
            x.state == this.loanState.LOANED ? total++ : null;
        });
        return total;
    });

    readonly totalReservations = computed(() => {
        const list = this.loanList();
        let total = 0;
        list.forEach((x) => {
            x.state == this.loanState.RESERVATED ? total++ : null;
        });
        return total;
    });
}
