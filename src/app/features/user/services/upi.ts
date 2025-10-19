import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WalletRechargeResponse } from '../models/wallet'; // We can reuse this response model

export interface UpiPaymentRequest {
  originStationId: number;
  destinationStationId: number;
  ticketType: 'ONE_WAY' | 'RETURN' | 'DAY_PASS';
}

@Injectable({
  providedIn: 'root'
})
export class UpiService {
  private apiUrl = `${environment.apiUrl}/upi`;

  constructor(private http: HttpClient) { }

  
  initiateUpiPayment(request: UpiPaymentRequest): Observable<WalletRechargeResponse> {
    return this.http.post<WalletRechargeResponse>(`${this.apiUrl}/pay`, request);
  }
}