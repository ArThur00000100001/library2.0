import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { LayoutHomeComponent } from './features/layout-home/layout-home';
import { RegisterComponent } from './features/auth/register/register';
import { authGuard } from './core/guard/auth.guard';
import { HomeComponent } from './features/admin/pages/home/home';
import { UsersComponent } from './features/admin/pages/users/users';
import { BookTitleComponent } from './features/admin/pages/title-books/book-titles';
import { LoansComponent } from './features/admin/pages/loans/loans';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            {
                path: 'student',
                component: LayoutHomeComponent,
                children: [],
            },
            {
                path: 'admin',
                component: LayoutHomeComponent,
                children: [
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                    { path: 'home', component: HomeComponent },
                    { path: 'users', component: UsersComponent },
                    { path: 'book-titles', component: BookTitleComponent },
                    { path: 'loans', component: LoansComponent },
                ],
            },
        ],
    },
    // {path: '', loadComponent: () => import ('./features/auth/login/login').then(m => m.LoginComponent)},
    // {path: 'login', component: LayoutHomeComponent},
    // {path: 'register', component: RegisterComponent}
];
