// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { UserLayoutComponent } from './layouts/user-layout/user-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { StaffLayoutComponent } from './layouts/staff-layout/staff-layout';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard], 
    loadChildren: () => import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES)
  },
   {
    path: 'staff',
    component: StaffLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/staff/staff.routes').then(r => r.STAFF_ROUTES)
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [authGuard], 
    loadChildren: () => import('./features/user/user.routes').then(r => r.USER_ROUTES)
  },
  { path: '', redirectTo: 'user/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];