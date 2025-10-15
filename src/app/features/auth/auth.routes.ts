import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { VerifyOtpComponent } from './verify-otp/verify-otp';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp/:email', component: VerifyOtpComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];