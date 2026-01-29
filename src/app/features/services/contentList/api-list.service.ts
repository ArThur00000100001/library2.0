import { inject, Injectable, signal } from '@angular/core';
import { IBook, IBookTitle, ILoan, IUser } from '../../admin/models/types';
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

    readonly usersList = signal<IUser[]>([]);
    readonly bookTitleList = signal<IBookTitle[]>([]);
    readonly loansList = signal<ILoan[]>([]);
    readonly copyBookList = signal<IBook[]>([]);

    //metodo para cargar lista de usuarios si es que se necesita
    async loadUserNeeded() {
        if (this.usersList().length > 0) return;
        const data = await this.apiUserService.list();
        this.usersList.set(data);
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
