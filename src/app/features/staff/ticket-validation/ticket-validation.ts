import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Station } from '../../user/services/station';
import { StationService } from '../../user/services/station';
import { ValidationService, ValidationResponse } from '../services/validation';

@Component({
  selector: 'app-ticket-validation',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './ticket-validation.html',
  styleUrls: ['./ticket-validation.scss']
})
export class TicketValidationComponent implements OnInit {
  validationForm: FormGroup;
  stations$!: Observable<Station[]>;
  isLoading = false;
  validationResult: ValidationResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private validationService: ValidationService
  ) {
    this.validationForm = this.fb.group({
      stationId: ['', Validators.required],
      qrCodePayload: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stations$ = this.stationService.getAllStations();
  }

  onValidate(): void {
    if (this.validationForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.validationResult = null;

    this.validationService.validateTicket(this.validationForm.value).subscribe({
      next: (response) => {
        this.validationResult = response;
        this.isLoading = false;
      },
      error: (err) => {
        // The backend should ideally wrap all errors in the response body,
        // but we'll handle network errors here too.
        this.validationResult = {
          valid: false,
          message: err.error?.message || 'An unexpected error occurred.',
          ticketNumber: null,
          validationTime: new Date().toISOString()
        };
        this.isLoading = false;
      }
    });
  }
}