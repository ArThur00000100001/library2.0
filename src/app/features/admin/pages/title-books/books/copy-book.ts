import { Component, signal, computed, ChangeDetectionStrategy, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBook, IBookTitle } from '../../../models/types';
import { CopyTitlesApiService } from './apiCopyTitles.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CopyConfirmedModal } from './copyConfirmedAdmin/copyConfirmedAdmin';

@Component({
    selector: 'app-book-titles',
    templateUrl: './copy-titles.html',
    styleUrl: './copy-titles.scss',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyBookComponent {
    // Signal for books list
    readonly apiCopyTitlesService = inject(CopyTitlesApiService);
    readonly modalActivate = inject(NgbActiveModal, { optional: true });
    readonly modalService = inject(NgbModal);

    readonly bookTitle = model<IBookTitle | null>(null);

    readonly searchTerm = signal('');

    readonly filteredCopies = computed(() => {
        const title = this.bookTitle();
        if (!title || !title.copies) return [];

        const search = this.searchTerm().toLowerCase();
        if (!search) return title.copies;

        return title.copies.filter(
            (copy) =>
                copy.id.toString().includes(search) ||
                (copy.isAvailable ? 'disponible' : 'no disponible').includes(search),
        );
    });

    //Obtiene la lista de usuarios con el backent

    async openCopyModal() {
        try {
            const ref = this.modalService.open(CopyConfirmedModal, {
                size: 'lg',
                backdrop: 'static',
            });

            const component: CopyConfirmedModal = ref.componentInstance;
            console.log(this.bookTitle());
            component.bookTitle.set(this.bookTitle());

            const result: IBook | undefined = await ref.result;

            if (result) {
                this.bookTitle.update((title) => {
                    if (!title) return title;
                    return {
                        ...title,
                        copies: [...(title.copies ?? []), result],
                    };
                });
            }
        } catch (err) {
            console.error('Error al abrir el modal:', err);
        }
    }

    async eliminateBook(id: number) {
        const response = await this.apiCopyTitlesService.delete(id);
        if (response.status == 'failure') return;
        this.bookTitle.update((title) => {
            if (!title) return title;
            return {
                ...title,
                copies: title.copies?.filter((x) => x.id !== id),
            };
        });
    }

    isAvailableCopys(): boolean {
        const copys = this.bookTitle()?.copies;
        const status = copys?.some((x) => x.isAvailable);
        return status!;
    }
}
