import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Station } from '../../user/services/station';

@Component({
  selector: 'app-station-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './station-dialog.html',
  styleUrls: ['./station-dialog.scss']
})
export class StationDialogComponent {
  stationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Station | null
  ) {
    this.stationForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      code: [data?.code || '', Validators.required],
      // --- THIS IS THE CORRECTED LINE ---
      stationOrder: [data?.stationOrder || null, [Validators.required, Validators.min(1)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.stationForm.valid) {
      this.dialogRef.close(this.stationForm.value);
    }
  }
}