import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.user();

  if (state.url == '/login') {
    if (user?.role == 'admin') return router.parseUrl('/admin');
    if (user?.role == 'user') return router.parseUrl('/student');
    return true
  }

  //acceso a todas las rutas del rol admin
  

  return false;
};
