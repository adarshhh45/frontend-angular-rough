import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: string;
  apiKey: string;
  cloudName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  
  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  getCloudinarySignature(): Observable<CloudinarySignature> {
    return this.http.post<CloudinarySignature>(`${this.apiUrl}/upload/signature`, {});
  }

  
  updateProfileImageUrl(imageUrl: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/update-image-url`, { imageUrl });
  }

  // ADD THIS NEW METHOD
  updateName(name: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/me`, { name });
  }

  deleteAccount(password: string): Observable<any> {
    const payload = { password };
    return this.http.delete(`${this.apiUrl}/me`, { body: payload, responseType: 'text' });
  }
}