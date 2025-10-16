import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { ProfileService, UserProfile, CloudinarySignature } from '../services/profile';
import { TokenStorage } from '../../../core/services/token-storage';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  isLoading = true;
  isUploading = false;
  isDeleting = false;

  private profileService = inject(ProfileService);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private tokenStorage = inject(TokenStorage);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.profileService.getCurrentUser().pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => this.user = data,
        error: () => this.snackBar.open('Failed to load user profile.', 'Close', { duration: 3000 })
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];

    // Validate file type and size
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.snackBar.open('Invalid file type. Only PNG and JPEG are allowed.', 'Close', { duration: 3000 });
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      this.snackBar.open('File size cannot exceed 2 MB.', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;

    // Step 1: Get signature from our backend
    this.profileService.getCloudinarySignature().subscribe({
      next: (sig) => this.uploadToCloudinary(file, sig),
      error: () => {
        this.snackBar.open('Could not get upload signature. Please try again.', 'Close', { duration: 3000 });
        this.isUploading = false;
      }
    });
  }

  private uploadToCloudinary(file: File, sig: CloudinarySignature): void {
    // Step 2: Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('signature', sig.signature);
    formData.append('timestamp', sig.timestamp);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

    this.http.post<any>(cloudinaryUrl, formData).subscribe({
      next: (response) => {
        // Step 3: Send the new URL to our backend
        this.profileService.updateProfileImageUrl(response.secure_url).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.snackBar.open('Profile picture updated successfully!', 'Close', { duration: 3000 });
            this.isUploading = false;
          },
          error: () => {
            this.snackBar.open('Failed to save the new image URL.', 'Close', { duration: 3000 });
            this.isUploading = false;
          }
        });
      },
      error: () => {
        this.snackBar.open('Failed to upload image to Cloudinary.', 'Close', { duration: 3000 });
        this.isUploading = false;
      }
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        this.isDeleting = true;
        this.profileService.deleteAccount(password)
          .pipe(finalize(() => this.isDeleting = false))
          .subscribe({
            next: () => {
              this.snackBar.open('Account deleted successfully.', 'Close', { duration: 5000 });
              this.tokenStorage.signOut();
              this.router.navigate(['/auth/login']);
            },
            error: (err) => {
              const errorMessage = err.error?.error?.message || 'Failed to delete account. Please check your password.';
              this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
            }
          });
      }
    });
  }
}