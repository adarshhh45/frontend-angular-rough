import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 
import { TokenStorage } from '../../../core/services/token-storage';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getAccessToken()) {
      // User already logged in, redirect based on role
      const userRole = this.tokenStorage.getRole();
      this.redirectBasedOnRole(userRole);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password, role } = this.loginForm.value;

    this.authService.login(email, password, role).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.isLoading = false;
        const userRole = this.tokenStorage.getRole();
        this.redirectBasedOnRole(userRole);
      },
      error: err => {
        this.errorMessage = err.error?.error?.message || err.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      }
    });
  }

  private redirectBasedOnRole(role: string | null): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'STAFF') {
      this.router.navigate(['/staff']);
    } else {
      this.router.navigate(['/user']);
    }
  }
}