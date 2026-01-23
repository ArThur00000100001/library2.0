import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly routerService = inject(Router)
  readonly user = signal<IUser | null>(null);

  constructor(){
    this.user.set(JSON.parse(localStorage.getItem('user') || 'null'));
  }

  logout(){
    this.user.set(null);
    this.routerService.navigate(['/login']);
  }
}
