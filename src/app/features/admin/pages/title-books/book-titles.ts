import {
    Component,
    signal,
    computed,
    ChangeDetectionStrategy,
    inject,
    model,
    resource,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBookTitle } from '../../models/types';
import { BooksTitlesApiService } from './apiBookTitles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookTitleFormComponent } from './BooksFormAdmin/bookTitleFormAdmin';
import { CopyBookComponent } from './books/copy-book';
import { ApiListService } from '../../../services/contentList/api-list.service';

@Component({
    selector: 'app-book-titles',
    templateUrl: './book-titles.html',
    styleUrl: './book-titles.scss',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTitleComponent {
    // Signal for books list
    readonly apiBookTitleService = inject(BooksTitlesApiService);
    readonly modalService = inject(NgbModal);
    readonly apiListService = inject(ApiListService);

    readonly bookTitleList = this.apiListService.bookTitleList;

    readonly totalCopys = computed(() => {
        let total = 0;
        const listBooks = this.bookTitleList();
        listBooks.forEach((x) => {
            x.copies!.length > 0 ? (total += x.copies!.length) : null;
        });
        return total;
    });

    constructor() {
        this.apiListService.loadBookTitlesList();
    }

    async openBookForm(mode: 'create' | 'edit' | 'import', data: IBookTitle | null = null) {
        try {
            const ref = this.modalService.open(BookTitleFormComponent, {
                size: 'lg',
                backdrop: 'static',
            });
            const component: BookTitleFormComponent = ref.componentInstance;
            component.mode.set(mode);
            //if (data == null) return;
            if (mode == 'edit') component.bookTitle.set(data);
            const result: IBookTitle | undefined = await ref.result;
            if (result) console.log('funcionaaa');
            if (!result) return;
            mode == 'create'
                ? this.bookTitleList.update((booksTitles) => [result, ...booksTitles])
                : null;
            mode == 'edit'
                ? this.bookTitleList.update((bookTitles) =>
                      bookTitles.map((b) => (b.id == result.id ? result : b)),
                  )
                : null;
        } catch (error) {
            console.log('Error al crear un libro: ', error);
        }
    }

    async openCopyModal(data: IBookTitle) {
        try {
            const ref = this.modalService.open(CopyBookComponent, {
                size: 'lg',
                //backdrop: 'static',
            });
            const component: CopyBookComponent = ref.componentInstance;
            component.bookTitle.set(data);

            // Al cerrar o dar click fuera (dismiss), capturamos el valor actual del model signal
            const result: IBookTitle | undefined = await ref.result.catch(() =>
                component.bookTitle(),
            );

            if (result) {
                this.bookTitleList.update((list) =>
                    list.map((b) => (b.id === result.id ? result : b)),
                );
            }
        } catch (err) {
            console.log('Error', err);
        }
    }

    async eliminateBook(id: number) {
        const response = await this.apiBookTitleService.delete(id);
        if (response.status == 'failure') return;
        this.bookTitleList.update((book) => book.filter((x) => x.id !== id));
    }
}
