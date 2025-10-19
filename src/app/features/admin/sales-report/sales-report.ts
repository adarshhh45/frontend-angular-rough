import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

import { AdminService, SalesReport } from '../services/admin';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './sales-report.html',
  styleUrls: ['./sales-report.scss']
})
export class SalesReportComponent {
  reportForm: FormGroup;
  reportData: SalesReport | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = this.fb.group({
      from: [new Date(), Validators.required],
      to: [new Date(), Validators.required]
    });
  }

  // Helper function to format date to YYYY-MM-DD
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.reportData = null;
    const { from, to } = this.reportForm.value;

    this.adminService.getSalesReport(this.formatDate(from), this.formatDate(to)).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.reportData = data;
      },
      error: (err) => {
        const errorMessage = err.error?.error?.message || 'Failed to generate report.';
        this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
      }
    });
  }
}