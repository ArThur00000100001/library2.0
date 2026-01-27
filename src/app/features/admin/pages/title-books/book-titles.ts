import { Component, signal, computed, ChangeDetectionStrategy, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBookTitle } from '../../models/types';
import { BooksTitlesApiService } from './apiBookTitles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookTitleFormComponent } from './BooksFormAdmin/bookTitleFormAdmin';

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

  readonly mode = model<'create' | 'edit' | 'import'>('create');

  readonly bookTitleList = signal<IBookTitle[]>([]);

  constructor() {
    this.getList();
  }

  //Obtiene la lista de usuarios con el backent
  async getList() {
    const response = await this.apiBookTitleService.list();
    if (response.length == 0) return;
    this.bookTitleList.set(response);
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
      if(result)
        console.log('funcionaaa')
      if (!result) return;
      
      mode == 'create'
        ? this.bookTitleList.update((booksTitles) => [result, ...booksTitles])
        : null;
    } catch (error) {console.log('Error al crear un libro: ', error)}
  }
}
