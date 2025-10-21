import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';

import { WalletService } from '../services/wallet';
import { TokenStorage } from '../../../core/services/token-storage';
import { Wallet } from '../models/wallet';
import { RechargeDialogComponent } from '../recharge-dialog/recharge-dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule 
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  wallet: Wallet | null = null;
  isLoading = true;
  user: any = {};

  constructor(
    private walletService: WalletService,
    private tokenStorage: TokenStorage,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUser(); //user info
    this.loadWallet();
  }

  loadWallet(): void {
    this.isLoading = true;
    this.walletService.getMyWallet().subscribe({
      next: (data) => {
        this.wallet = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Could not load wallet details.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openRechargeDialog(): void {
    const dialogRef = this.dialog.open(RechargeDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(amount => {
      if (amount) {
        this.walletService.initiateRecharge(amount).subscribe({
          next: (res) => {
            this.payWithRazorpay(res);
          },
          error: (err) => {
            this.snackBar.open('Failed to initiate recharge. Please try again.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  private payWithRazorpay(response: any): void {
    const options = {
      key: response.apiKey,
      amount: response.amount,
      currency: response.currency,
      name: 'Metro Ticket System',
      description: 'Wallet Recharge',
      order_id: response.razorpayOrderId,
      handler: (res: any) => {
        this.snackBar.open('Recharge successful!', 'Close', { duration: 4000 });
        this.loadWallet(); 
      },
      prefill: {
        name: this.user.name,
        email: this.user.email
      },
      theme: {
        color: '#3F51B5'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }
}