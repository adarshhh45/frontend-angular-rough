import { Routes } from '@angular/router';
import { TicketValidationComponent } from './ticket-validation/ticket-validation';

export const STAFF_ROUTES: Routes = [
  { path: 'validate', component: TicketValidationComponent },
  { path: '', redirectTo: 'validate', pathMatch: 'full' }
];