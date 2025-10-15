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
      // This endpoint handles both USER and STAFF roles
      loginUrl = AUTH_API + 'user/login';
    }

    return this.http.post(loginUrl, credentials, httpOptions);
  }

  register(signUpRequest: SignUpRequest): Observable<string> {
    return this.http.post<string>(AUTH_API + 'register', signUpRequest);
  }

  verifyOtp(verifyRequest: VerifyOtpRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AUTH_API + 'verify-otp', verifyRequest);
  }
}