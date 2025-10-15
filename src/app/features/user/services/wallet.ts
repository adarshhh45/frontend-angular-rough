import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Wallet, WalletRechargeResponse } from '../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) { }

  getMyWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/me`);
  }

  initiateRecharge(amount: number): Observable<WalletRechargeResponse> {
    return this.http.post<WalletRechargeResponse>(`${this.apiUrl}/recharge/initiate`, { amount });
  }
}