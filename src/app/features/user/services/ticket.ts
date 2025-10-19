// src/app/features/user/services/ticket.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Import the models we just created
import { Ticket } from '../models/ticket';
import { FareResponse } from '../models/fare';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

  getFare(originId: number, destId: number, ticketType: string): Observable<FareResponse> {
    const params = new HttpParams()
      .set('originId', originId.toString())
      .set('destId', destId.toString())
      .set('type', ticketType);
    return this.http.get<FareResponse>(`${this.apiUrl}/fare`, { params });
  }

  bookTicket(bookingRequest: any): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/book`, bookingRequest);
  }

  getTicketHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }
  cancelTicket(ticketId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/${ticketId}/cancel`, {});
  }

  downloadTicketQr(ticketId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${ticketId}/download`, {
      responseType: 'blob' // Important: We expect a binary file, not JSON
    });
  }
}