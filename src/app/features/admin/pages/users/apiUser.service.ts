import { inject, Injectable } from '@angular/core';
import { ApiFetchService } from '../../../services/apiFetch.service';
import { ToastrService } from 'ngx-toastr';
import { API } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class apiUserService {
  readonly toastrService = inject(ToastrService);
  readonly apiFetchService = inject(ApiFetchService);

  async list(): Promise<IUser[]> {
    const response = await this.apiFetchService.getApiAuth<IUser[]>(`${API}/users`);
    return response.status === 'success' ? response.data : [];
  }

  async delete(id: number) {
    const response = await this.apiFetchService.deleteApiAuth(`${API}/users/${id}`);
    if (response.status === 'success') this.toastrService.success(response.message, 'Éxito');
    return response;
  }

  async create(body: Partial<IUser>) {
    const response = await this.apiFetchService.postApiAuth<IUser>(`${API}/users`, body);
    if (response.status === 'success') this.toastrService.success(response.message, 'Éxito');
    return response;
  }

  async edit(id: number, body: Partial<IUser>) {
    const response = await this.apiFetchService.patchApiAuth<IUser>(`${API}/users/${id}`, body);
    if (response.status === 'success') this.toastrService.success(response.message, 'Éxito');
    return response;
  }
}
