import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, ILoginResponse } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const tokenRaw = localStorage.getItem('token-raw');
    let tokenParse: ILoginResponse | null = tokenRaw != null ? JSON.parse(tokenRaw) : null;
    const role = tokenParse?.user.role;

    if (state.url == '/login') {
        if (role == 'admin') return router.parseUrl('/admin');
        if (role == 'student') return router.parseUrl('/student');
        return true;
    }

    if (role == 'admin') {
        if (state.url.startsWith('/admin')) {
            return isCorrectAuth(tokenParse!);
        }
        return router.parseUrl('/admin');
    }

    if (role == 'student') {
        if (state.url.startsWith('/student')) return isCorrectAuth(tokenParse!);
        return router.parseUrl('/student');
    }

    return router.parseUrl('/login');
};

const isCorrectAuth = (tokenData: ILoginResponse) => {
    const authService = inject(AuthService);
    authService.token.set(tokenData.access_token);
    authService.user.set(tokenData.user);
    return true;
};
