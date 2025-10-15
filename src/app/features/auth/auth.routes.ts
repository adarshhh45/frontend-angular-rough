import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { VerifyOtpComponent } from './verify-otp/verify-otp';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp/:email', component: VerifyOtpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:email', component: ResetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];