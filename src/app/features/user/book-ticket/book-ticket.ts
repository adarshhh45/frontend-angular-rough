// src/app/features/user/book-ticket/book-ticket.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

// --- VERIFY THESE IMPORTS ---
import { TicketService } from '../services/ticket';
import { Station, StationService } from '../services/station';
import { Ticket } from '../models/ticket'; // <-- Added import
import { FareResponse } from '../models/fare'; // <-- Added import

// --- ANGULAR MATERIAL IMPORTS ---
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './book-ticket.html',
  styleUrl: './book-ticket.scss'
})
export class BookTicketComponent implements OnInit {
  bookingForm: FormGroup;
  stations$!: Observable<Station[]>;
  fare$ = new Subject<number | null>();

  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private ticketService: TicketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      originId: ['', Validators.required],
      destId: ['', Validators.required],
      ticketType: ['ONE_WAY', Validators.required],
      paymentMethod: ['WALLET', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stations$ = this.stationService.getAllStations().pipe(
      catchError(err => {
        this.errorMessage = 'Could not load stations. Please try again later.';
        return of([]);
      })
    );
    this.setupFareCalculationListener();
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
        this.isLoading = true;
        this.fare$.next(null);
        // NO ERROR HERE ANYMORE
        return this.ticketService.getFare(formValue.originId, formValue.destId, formValue.ticketType).pipe(
          catchError(err => {
            const errorMsg = err.error?.error?.message || 'Could not calculate fare.';
            this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
            return of(null);
          })
        );
      })
    ).subscribe((fareResponse: FareResponse | null) => { // Type the response
      this.isLoading = false;
      if (fareResponse) {
        this.fare$.next(fareResponse.fare);
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const bookingDetails = this.bookingForm.value;

    if (bookingDetails.paymentMethod === 'WALLET') {
      this.bookWithWallet();
    } else if (bookingDetails.paymentMethod === 'UPI') {
      this.snackBar.open('UPI payment is not yet implemented.', 'Close', { duration: 3000 });
      this.isLoading = false;
    }
  }

  private bookWithWallet(): void {
    const { originId, destId, ticketType, paymentMethod } = this.bookingForm.value;
    const bookingRequest = {
      originStationId: originId,
      destinationStationId: destId,
      ticketType,
      paymentMethod
    };

    // NO ERROR HERE ANYMORE
    this.ticketService.bookTicket(bookingRequest).pipe(
      catchError(err => {
        this.errorMessage = err.error?.error?.message || 'An unknown booking error occurred.';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe((ticket: Ticket | null) => { // Type the response: FIXES THE 'any' ERROR
      this.isLoading = false;
      if (ticket) {
        this.snackBar.open('Ticket booked successfully!', 'OK', { duration: 3000 });
        this.router.navigate(['/user/ticket-history']);
      }
    });
  }

  private payWithUpi(): void {
    // Placeholder
  }
}