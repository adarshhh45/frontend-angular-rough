import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FareSlab } from '../services/admin';

@Component({
  selector: 'app-fare-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './fare-dialog.html',
  styleUrls: ['./fare-dialog.scss']
})
export class FareDialogComponent {
  fareForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FareSlab | null
  ) {
    this.fareForm = this.fb.group({
      minStations: [data?.minStations || null, [Validators.required, Validators.min(0)]],
      maxStations: [data?.maxStations || null, [Validators.required, Validators.min(1)]],
      fare: [data?.fare || null, [Validators.required, Validators.min(5)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.fareForm.valid) {
      this.dialogRef.close(this.fareForm.value);
    }
  }
}