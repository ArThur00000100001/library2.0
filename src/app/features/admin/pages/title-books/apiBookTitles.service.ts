import { inject, Injectable } from '@angular/core';
import { API } from '../../../environment/environment';
import { ApiFetchService } from '../../../services/apiFetch.service';
import { ToastrService } from 'ngx-toastr';
import { IBookTitle } from '../../models/types';

@Injectable({
  providedIn: 'root',
})
export class BooksTitlesApiService {
  readonly toastr = inject(ToastrService);
  readonly apiService = inject(ApiFetchService);

  async list(): Promise<IBookTitle[]> {
    const response = await this.apiService.getApiAuth<IBookTitle[]>(`${API}/book-titles`);
    return response.status === 'success' ? response.data : [];
  }

  async delete(id: number) {
    const response = await this.apiService.deleteApiAuth(`${API}/book-titles/${id}`);
    if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
    return response;
  }

  async create(body: Partial<IBookTitle>) {
    const response = await this.apiService.postApiAuth<IBookTitle>(`${API}/book-titles`, body);
    if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
    return response;
  }

  async edit(id: number, params: Partial<IBookTitle>) {
    const response = await this.apiService.patchApiAuth<IBookTitle>(
      `${API}/book-titles/${id}`,
      params,
    );
    if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
    return response;
  }
}
