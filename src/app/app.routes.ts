import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { LayoutHomeComponent } from './features/layout-home/layout-home';
import { RegisterComponent } from './features/auth/register/register';

export const routes: Routes = [
    {path: '', loadComponent: () => import ('./features/auth/login/login').then(m => m.LoginComponent)},
    {path: 'login', component: LayoutHomeComponent},
    {path: 'register', component: RegisterComponent}
];
