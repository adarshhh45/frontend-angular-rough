import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // <-- FIX: Import MatDialog
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs/operators';

import { ProfileService, UserProfile, CloudinarySignature } from '../services/profile';
import { TokenStorage } from '../../../core/services/token-storage';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  profileForm: FormGroup;
  isLoading = true;
  isUploading = false;
  isSavingName = false;
  isDeleting = false;

  private profileService = inject(ProfileService);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog); // <-- FIX: Inject MatDialog, not Dialog
  private router = inject(Router);
  private tokenStorage = inject(TokenStorage);
  private fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.profileService.getCurrentUser().pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.user = data;
          this.profileForm.patchValue({ name: data.name });
        },
        error: () => this.snackBar.open('Failed to load user profile.', 'Close', { duration: 3000 })
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      this.snackBar.open('Invalid file. Please select a PNG/JPEG under 2MB.', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    this.profileService.getCloudinarySignature().subscribe({
      next: (sig) => this.uploadToCloudinary(file, sig),
      error: () => {
        this.snackBar.open('Could not get upload signature.', 'Close', { duration: 3000 });
        this.isUploading = false;
      }
    });
  }

  private uploadToCloudinary(file: File, sig: CloudinarySignature): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('signature', sig.signature);
    formData.append('timestamp', sig.timestamp);

    this.http.post<any>(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, formData)
      .pipe(finalize(() => this.isUploading = false))
      .subscribe({
        next: (response) => this.saveImageUrlToBackend(response.secure_url),
        error: () => this.snackBar.open('Failed to upload image.', 'Close', { duration: 3000 })
      });
  }

  private saveImageUrlToBackend(imageUrl: string): void {
    this.profileService.updateProfileImageUrl(imageUrl).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.snackBar.open('Profile picture updated!', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to save the new image URL.', 'Close', { duration: 3000 })
    });
  }

  onSaveName(): void {
    if (this.profileForm.invalid || !this.user || this.user.name === this.profileForm.value.name) {
      return;
    }
    this.isSavingName = true;
    this.profileService.updateName(this.profileForm.value.name)
      .pipe(finalize(() => this.isSavingName = false))
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.snackBar.open('Name updated successfully!', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Failed to update name.', 'Close', { duration: 3000 })
      });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, { width: '400px' });

    // FIX: Add the 'string' type to the password parameter
    dialogRef.afterClosed().subscribe((password: string | undefined) => { 
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
            error: (err) => this.snackBar.open(err.error?.error?.message || 'Failed to delete account.', 'Close', { duration: 5000 })
          });
      }
    });
  }
}