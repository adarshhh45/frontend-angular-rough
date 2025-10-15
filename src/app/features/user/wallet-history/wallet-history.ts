import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WalletService } from '../services/wallet';
import { Wallet } from '../models/wallet';

@Component({
  selector: 'app-wallet-history',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './wallet-history.html',
  styleUrls: ['./wallet-history.scss']
})
export class WalletHistoryComponent implements OnInit {
  wallet: Wallet | null = null;
  isLoading = true;

  constructor(
    private walletService: WalletService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.walletService.getMyWallet().subscribe({
      next: (data) => {
        this.wallet = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load transaction history.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}