import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { TicketService } from '../services/ticket';
import { Station, StationService } from '../services/station';
import { UpiService } from '../services/upi';
import { TokenStorage } from '../../../core/services/token-storage';
import { Ticket } from '../models/ticket';
import { FareResponse } from '../models/fare';
import { WalletRechargeResponse } from '../models/wallet';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './book-ticket.html',
  styleUrls: ['./book-ticket.scss']
})
export class BookTicketComponent implements OnInit {
  bookingForm: FormGroup;
  stations$!: Observable<Station[]>;
  fare$ = new Subject<number | null>();
  isLoading = false;
  errorMessage = '';
  user: any;

  private stationService = inject(StationService);
  private ticketService = inject(TicketService);
  private upiService = inject(UpiService);
  private tokenStorage = inject(TokenStorage);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    this.bookingForm = this.fb.group({
      originId: ['', Validators.required],
      destId: ['', Validators.required],
      ticketType: ['ONE_WAY', Validators.required],
      paymentMethod: ['WALLET', Validators.required]
    });
  }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUser();
    this.stations$ = this.stationService.getAllStations().pipe(
      catchError(() => {
        this.errorMessage = 'Could not load stations. Please try again later.';
        return of([]);
      })
    );
    this.setupFareCalculationListener();
  }

  // New method to swap stations
  swapStations(): void {
    const originId = this.bookingForm.get('originId')?.value;
    const destId = this.bookingForm.get('destId')?.value;
    
    if (originId && destId) {
      this.bookingForm.patchValue({
        originId: destId,
        destId: originId
      });
    }
  }

  private setupFareCalculationListener(): void {
    this.bookingForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) =>
        prev.originId === curr.originId &&
        prev.destId === curr.destId &&
        prev.ticketType === curr.ticketType
      ),
      filter(formValue => formValue.originId && formValue.destId && formValue.ticketType),
      switchMap(formValue => {
        return this.ticketService.getFare(formValue.originId, formValue.destId, formValue.ticketType).pipe(
          catchError(err => {
            const errorMsg = err.error?.error?.message || 'Could not calculate fare.';
            this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
            this.fare$.next(null);
            return of(null);
          })
        );
      })
    ).subscribe((fareResponse: FareResponse | null) => {
      this.fare$.next(fareResponse ? fareResponse.fare : null);
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { paymentMethod } = this.bookingForm.value;

    if (paymentMethod === 'WALLET') {
      this.bookWithWallet();
    } else if (paymentMethod === 'UPI') {
      this.payWithUpi();
    }
  }

  private bookWithWallet(): void {
    const { originId, destId, ticketType, paymentMethod } = this.bookingForm.value;
    this.ticketService.bookTicket({
      originStationId: originId,
      destinationStationId: destId,
      ticketType,
      paymentMethod
    }).pipe(
      catchError(err => {
        this.errorMessage = err.error?.error?.message || 'An unknown booking error occurred.';
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Close', { duration: 4000 });
        return of(null);
      })
    ).subscribe((ticket: Ticket | null) => {
      this.isLoading = false;
      if (ticket) {
        this.snackBar.open('🎉 Ticket booked successfully!', 'View', { duration: 4000 })
          .onAction().subscribe(() => {
            this.router.navigate(['/user/ticket-history']);
          });
        setTimeout(() => {
          this.router.navigate(['/user/ticket-history']);
        }, 2000);
      }
    });
  }

  private payWithUpi(): void {
    const { originId, destId, ticketType } = this.bookingForm.value;
    this.upiService.initiateUpiPayment({
      originStationId: originId,
      destinationStationId: destId,
      ticketType
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.launchRazorpayCheckout(res);
      },
      error: (err) => {
        this.errorMessage = err.error?.error?.message || 'Failed to initiate UPI payment.';
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      }
    });
  }

  private launchRazorpayCheckout(response: WalletRechargeResponse): void {
    const options = {
      key: response.apiKey,
      amount: response.amount,
      currency: response.currency,
      name: 'Metro Ticket System',
      description: 'Ticket Purchase',
      order_id: response.razorpayOrderId,
      handler: () => {
        this.snackBar.open('Payment successful! Your ticket has been booked.', 'OK', { duration: 5000 });
        this.router.navigate(['/user/ticket-history']);
      },
      prefill: {
        name: this.user.name || '',
        email: this.user.email || ''
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          this.snackBar.open('Payment was cancelled.', 'Close', { duration: 3000 });
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }
}