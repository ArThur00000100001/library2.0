import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';



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

  logout(){
    localStorage.removeItem('token-raw')
    this.router.navigate(['/login'])
  }
}
