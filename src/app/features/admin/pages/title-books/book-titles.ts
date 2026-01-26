import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBookTitle } from '../../models/types';
import { BooksTitlesApiService } from './apiBookTitles.service';

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
}
