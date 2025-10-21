import { Routes } from '@angular/router';
import { StaffDashboardComponent } from './dashboard/dashboard';
import { TicketValidationComponent } from './ticket-validation/ticket-validation';

export const STAFF_ROUTES: Routes = [
  { path: 'dashboard', component: StaffDashboardComponent },
  { path: 'validate', component: TicketValidationComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];