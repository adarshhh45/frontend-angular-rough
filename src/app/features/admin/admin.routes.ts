import { Routes } from '@angular/router';
import { StationManagementComponent } from './station-management/station-management';

export const ADMIN_ROUTES: Routes = [
  { path: 'stations', component: StationManagementComponent },
  { path: '', redirectTo: 'stations', pathMatch: 'full' }
];