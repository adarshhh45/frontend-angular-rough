import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Import services and interfaces
import { AuthService, VerifyOtpRequest } from '../../../core/services/auth';
import { TokenStorage } from '../../../core/services/token-storage';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.scss']
})
export class VerifyOtpComponent implements OnInit {
  verifyForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private route: ActivatedRoute // To read the email from the URL
  ) {
    this.verifyForm = this.fb.group({
      otpCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the email from the route parameter
    const emailFromRoute = this.route.snapshot.paramMap.get('email');
    if (!emailFromRoute) {
      // If no email is found, redirect to login
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userEmail = emailFromRoute;
  }

  onSubmit(): void {
    if (this.verifyForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const verifyData: VerifyOtpRequest = {
      email: this.userEmail,
      otpCode: this.verifyForm.value.otpCode
    };

    this.authService.verifyOtp(verifyData).subscribe({
      next: data => {
        this.isLoading = false;
        // Save the token and redirect to the user dashboard
        this.tokenStorage.saveToken(data.accessToken);
        this.router.navigate(['/user/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error?.error?.message || 'Invalid OTP or an error occurred.';
        this.isLoading = false;
      }
    });
  }
}