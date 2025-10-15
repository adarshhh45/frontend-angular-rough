import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ScanRequest {
  qrCodePayload: string;
  stationId: number;
}

export interface ValidationResponse {
  valid: boolean;
  message: string;
  ticketNumber: string | null;
  validationTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private apiUrl = `${environment.apiUrl}/validate`;

  constructor(private http: HttpClient) { }

  validateTicket(request: ScanRequest): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/scan`, request);
  }
}