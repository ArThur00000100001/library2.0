import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../features/admin/models/types';



export type ILoginResponse = {
  access_token: string;
  user: IUser;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);

  token = signal<string>(null!);
  user = signal<IUser>(null!);
  role = computed(() => this.user().role);

  logout() {
    localStorage.removeItem('token-raw');
    this.user.set(null!);
    this.token.set(null!);
    this.router.navigate(['/login']);
  }
}
