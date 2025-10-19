import { Routes } from '@angular/router';
import { StationManagementComponent } from './station-management/station-management';
import { FareManagementComponent } from './fare-management/fare-management';
import { SalesReportComponent } from './sales-report/sales-report'; 

export const ADMIN_ROUTES: Routes = [
  { path: 'stations', component: StationManagementComponent },
  { path: 'fares', component: FareManagementComponent },
  { path: 'reports', component: SalesReportComponent }, 
  { path: '', redirectTo: 'stations', pathMatch: 'full' }
];