import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { IBook, IBookTitle, ILoan, IUser, LoanState } from '../../admin/models/types';
import { apiUserService } from '../../admin/pages/users/apiUser.service';
import { BooksTitlesApiService } from '../../admin/pages/title-books/apiBookTitles.service';
import { CopyTitlesApiService } from '../../admin/pages/title-books/books/apiCopyTitles.service';
import { ApiLoanService } from '../../admin/pages/loans/apiLoan.service';
import { CopyBookComponent } from '../../admin/pages/title-books/books/copy-book';

@Injectable({
    providedIn: 'root',
})
export class ApiListService {
    readonly apiUserService = inject(apiUserService);
    readonly apiBookTitleService = inject(BooksTitlesApiService);
    readonly apiCopyTitlesService = inject(CopyTitlesApiService);
    readonly apiLoanService = inject(ApiLoanService);
    readonly apiCopyService = inject(CopyTitlesApiService);
    readonly loanState = LoanState;

    readonly usersList = signal<IUser[]>([]);
    readonly newUsers = signal<IUser[]>([]);

    readonly bookTitleList = signal<IBookTitle[]>([]);
    readonly newBooktitles = signal<IBookTitle[]>([]);

    readonly loansList = signal<ILoan[]>([]);
    readonly newLoans = signal<ILoan[]>([]);

    readonly copyBookList = signal<IBook[]>([]);

    constructor() {
        //Lista de usuarios nuevos
        effect(() => {
            const date = new Date().toISOString().split('T')[0];
            const newUsersList = this.usersList().filter((x) => x.joinDate == date);

            untracked(() => {
                //console.log(newUsersList);
                this.newUsers.set(newUsersList);
            });
        });

        //Lista de libros nuevos
        // effect(() => {
        //     const date = new Date().toISOString().split('T')[0];
        //     const newTitlesList = this.usersList().filter((x) => x.joinDate == date);

        //     untracked(() => {
        //         //console.log(newUsersList);
        //         this.newUsers.set(newTitlesList);
        //     });
        // });

        //Lista de prestamos nuevos
        effect(() => {
            const date = new Date().toISOString().split('T')[0];
            const newLoansList = this.loansList().filter(
                (x) => x.loanDate == date && x.state == this.loanState.LOANED,
            );

            untracked(() => {
                this.newLoans.set(newLoansList);
            });
        });
    }

    //metodo para cargar lista de usuarios si es que se necesita
    async loadUserNeeded() {
        if (this.usersList().length > 0) return;
        const data = await this.apiUserService.list();
        this.usersList.set(data.map((data) => ({ ...data, isOnline: false })));
    }

    //metodo para cargar lista de libros si es que se necesita
    async loadBookTitlesList() {
        if (this.bookTitleList().length > 0) return;
        const data = await this.apiBookTitleService.list();
        this.bookTitleList.set(data);
    }

    async loadCopyBookList() {
        if (this.copyBookList().length > 0) return;
        const data = await this.apiCopyService.list();
        this.copyBookList.set(data);
    }

    //metodo para cargar lista de prestamos si es que se necesita
    async loadLoanList() {
        if (this.loansList().length > 0) return;
        const data = await this.apiLoanService.list();
        this.loansList.set(data);
    }
}
