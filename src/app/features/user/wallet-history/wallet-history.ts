import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { WalletService } from '../services/wallet';
import { Wallet } from '../models/wallet';

@Component({
  selector: 'app-wallet-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
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
        // Sort transactions from newest to oldest
        data.transactions.sort((a, b) => new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime());
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