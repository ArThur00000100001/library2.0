import { inject, Injectable, signal } from '@angular/core';
import { IBookTitle, IUser } from '../../admin/models/types';
import { apiUserService } from '../../admin/pages/users/apiUser.service';
import { BooksTitlesApiService } from '../../admin/pages/title-books/apiBookTitles.service';
import { CopyTitlesApiService } from '../../admin/pages/title-books/books/apiCopyTitles.service';

@Injectable({
    providedIn: 'root',
})
export class ApiContentListService {
    constructor() {
        this.getUserList();
        this.getBookTitlesList();
    }

    readonly apiUserService = inject(apiUserService);
    readonly apiBookTitleService = inject(BooksTitlesApiService);
    readonly apiCopyTitlesService = inject(CopyTitlesApiService);

    readonly usersList = signal<IUser[]>([]);
    readonly bookTitleList = signal<IBookTitle[]>([]);

    //Obtiene la lista de usuarios
    async getUserList() {
        const response = await this.apiUserService.list();
        if (response.length == 0) return;
        this.usersList.set(response);
        console.log(this.usersList());
    }

    async getBookTitlesList() {
        const response = await this.apiBookTitleService.list();
        if (response.length == 0) return;
        this.bookTitleList.set(response);
    }
}
