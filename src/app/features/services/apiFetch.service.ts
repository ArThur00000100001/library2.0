import { inject, Injectable } from '@angular/core';
import { API } from '../environment/environment';
import { AuthService } from '../../core/guard/auth.service';
import { ToastrService } from 'ngx-toastr';

export type IApiResponse<T = any> = {
  status: 'success' | 'failure';
  data: T;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class ApiFetchService {
  readonly authService = inject(AuthService);
  readonly toastrService = inject(ToastrService)

  private async _fetch(
    method: string,
    url: string,
    body: Record<string, any> = {},
    authorization: string | null = null,
  ) {
    let res: Response;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (authorization) headers['Authorization'] = `Bearer ${authorization}`;

        res = await fetch(url, {
            method: method,
            headers: headers,
            body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(body),
        });

        if (!res.ok) return { status: 'failure', data: null, message: 'Petición fallida' };
        return await res.json();
  }

   _fetchAuth = async <T = any>(method: string, url: string, body: Record<string, any> = {}) => {
        const res = (await this._fetch(
            method,
            url,
            body,
            this.authService.token(),
        )) as IApiResponse<T>;

        if (res.status == 'failure' || res.status !== 'success')
            this.toastrService.error(res.message, 'Error');

        return res;
    };
    //get
    get = async (url: string) => this._fetch('GET', url);

    //post

    post = async (url: string, body: Record<string, any>) => this._fetch('POST', url, body);

    //patch
    patch = async (url: string, body: Record<string, any>) => this._fetch('PATCH', url, body);

    //delete
    delete = async (url: string) => this._fetch('DELETE', url);

    //put
    put = async (url: string, body: Record<string, any>) => this._fetch('PUT', url, body);

    // getApi = async <T>(url: string) => (await this.get(url)) as IApiResponse<T>;
    async getApi<T>(url: string) {
        const response = await this.get(url);
        return response as IApiResponse<T>;
    }

    postApi = async <T = any>(url: string, body: Record<string, any>) =>
        (await this.post(url, body)) as IApiResponse<T>;
    patchApi = async <T = any>(url: string, body: Record<string, any>) =>
        (await this.patch(url, body)) as IApiResponse<T>;
    deleteApi = async <T = any>(url: string) => (await this.delete(url)) as IApiResponse<T>;
    putApi = async <T = any>(url: string, body: Record<string, any>) =>
        (await this.put(url, body)) as IApiResponse<T>;

    getApiAuth = async <T = any>(url: string) => await this._fetchAuth<T>('GET', url);

    postApiAuth = async <T = any>(url: string, body: Record<string, any>) =>
        await this._fetchAuth<T>('POST', url, body);

    patchApiAuth = async <T = any>(url: string, body: Record<string, any>) =>
        await this._fetchAuth<T>('PATCH', url, body);

    deleteApiAuth = async <T = any>(url: string) => await this._fetchAuth<T>('DELETE', url);

    putApiAuth = async <T = any>(url: string, body: Record<string, any>) =>
        await this._fetchAuth<T>('PUT', url, body);

    async fileImport(route: string, archive: File | null): Promise<any | undefined> {
        const formData = new FormData();
        if (archive == null) return;
        formData.append('file', archive);

        const response = await fetch(`${API}/${route}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${this.authService.token()}`,
            },
        });

        return response;
    }
}
