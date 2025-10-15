import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

const AUTH_API = `${environment.apiUrl}/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string, role: 'USER' | 'ADMIN'): Observable<any> {
    const credentials = { email, password };
    let loginUrl = '';

    if (role === 'ADMIN') {
      loginUrl = AUTH_API + 'admin/login';
    } else {
      loginUrl = AUTH_API + 'user/login';
    }

    return this.http.post(loginUrl, credentials, httpOptions);
  }


  register(signUpRequest: SignUpRequest): Observable<string> {
    //tell HttpClient to expect a plain text response
    return this.http.post(AUTH_API + 'register', signUpRequest, { responseType: 'text' });
  }

  verifyOtp(verifyRequest: VerifyOtpRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AUTH_API + 'verify-otp', verifyRequest);
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post(AUTH_API + 'forgot-password', { email }, { responseType: 'text' });
  }

  resetPassword(request: ResetPasswordRequest): Observable<string> {
    return this.http.post(AUTH_API + 'reset-password', request, { responseType: 'text' });
  }
}