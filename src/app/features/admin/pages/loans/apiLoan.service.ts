import { inject, Injectable } from '@angular/core';
import { API } from '../../../environment/environment';
import { ApiFetchService } from '../../../services/apiFetch.service';
import { ToastrService } from 'ngx-toastr';
import { IBookTitle, ILoan } from '../../models/types';

@Injectable({
    providedIn: 'root',
})
export class ApiLoanService {
    readonly toastr = inject(ToastrService);
    readonly apiService = inject(ApiFetchService);

    async list(): Promise<ILoan[]> {
        const response = await this.apiService.getApiAuth<ILoan[]>(`${API}/loans`);
        return response.status === 'success' ? response.data : [];
    }

    async delete(id: number) {
        const response = await this.apiService.deleteApiAuth(`${API}/loans/${id}`);
        if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
        return response;
    }

    async create(body: Partial<ILoan>) {
        const response = await this.apiService.postApiAuth<ILoan>(`${API}/loans`, body);
        if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
        return response;
    }

    async edit(id: number, params: Partial<ILoan>) {
        const response = await this.apiService.patchApiAuth<ILoan>(`${API}/loans/${id}`, params);
        if (response.status === 'success') this.toastr.success(response.message, 'Éxito');
        return response;
    }
}
