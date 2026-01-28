import { inject, Injectable } from '@angular/core';
import { API } from '../../../../environment/environment';
import { ApiFetchService } from '../../../../services/apiFetch.service';
import { ToastrService } from 'ngx-toastr';
import { IBook, IBookTitle } from '../../../models/types';

@Injectable({
    providedIn: 'root',
})
export class CopyTitlesApiService {
    readonly toastr = inject(ToastrService);
    readonly apiService = inject(ApiFetchService);

    async list(): Promise<IBook[]> {
        const response = await this.apiService.getApiAuth<IBook[]>(`${API}/books`);
        return response.status === 'success' ? response.data : [];
    }

    async delete(id: number) {
        const response = await this.apiService.deleteApiAuth(`${API}/books/${id}`);
        if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
        return response;
    }

    async create(body: Partial<IBook>) {
        const response = await this.apiService.postApiAuth<IBook>(`${API}/books`, body);
        if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
        return response;
    }

    async edit(id: number, params: Partial<IBook>) {
        const response = await this.apiService.patchApiAuth<IBook>(
            `${API}/book-titles/${id}`,
            params,
        );
        if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
        return response;
    }
}
