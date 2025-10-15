import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatSnackBarModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.resetPasswordForm = this.fb.group({
      otpCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const emailFromRoute = this.route.snapshot.paramMap.get('email');
    if (!emailFromRoute) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userEmail = emailFromRoute;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      email: this.userEmail,
      ...this.resetPasswordForm.value
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Password has been reset successfully! Please log in.', 'Close', { duration: 5000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error?.message || 'Failed to reset password. The OTP may be incorrect or expired.';
      }
    });
  }
}