import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// DTOs that match the backend
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

  /**
   * Gets the current user's profile information.
   */
  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  /**
   * Step 1: Get the upload signature from our backend.
   */
  getCloudinarySignature(): Observable<CloudinarySignature> {
    return this.http.post<CloudinarySignature>(`${this.apiUrl}/upload/signature`, {});
  }

  /**
   * Step 3: Send the uploaded image URL to our backend to save it.
   */
  updateProfileImageUrl(imageUrl: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/update-image-url`, { imageUrl });
  }
  deleteAccount(password: string): Observable<any> {
    // The backend expects a request body with a 'password' field
    const payload = { password };
    return this.http.delete(`${this.apiUrl}/me`, { body: payload, responseType: 'text' });
  }
}