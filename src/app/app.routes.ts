import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { LayoutHomeComponent } from './features/layout-home/layout-home';
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
            {
                path: 'student',
                component: LayoutHomeComponent,
                children: [
                    { path: '', redirectTo: 'books', pathMatch: 'full' },
                    {
                        path: 'books',
                        loadComponent: () =>
                            import('./features/student/pages/books/books').then(
                                (m) => m.StudentBooksComponent,
                            ),
                    },
                    {
                        path: 'loans',
                        loadComponent: () =>
                            import('./features/student/pages/loans/loans').then(
                                (m) => m.StudentLoansComponent,
                            ),
                    },
                    {
                        path: 'reservations',
                        loadComponent: () =>
                            import('./features/student/pages/reservations/reservations').then(
                                (m) => m.StudentReservationsComponent,
                            ),
                    },
                ],
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
                    {
                        path: 'reservations',
                        loadComponent: () =>
                            import('./features/admin/pages/reservations/reservations').then(
                                (m) => m.AdminReservationsComponent,
                            ),
                    },
                ],
            },
        ],
    },
];
