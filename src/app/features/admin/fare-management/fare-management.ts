import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AdminService, FareSlab } from '../services/admin';
import { FareDialogComponent } from '../fare-dialog/fare-dialog';

@Component({
  selector: 'app-fare-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './fare-management.html',
  styleUrls: ['./fare-management.scss']
})
export class FareManagementComponent implements OnInit {
  displayedColumns: string[] = ['minStations', 'maxStations', 'fare', 'actions'];
  fareSlabs: FareSlab[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFareSlabs();
  }

  loadFareSlabs(): void {
    this.isLoading = true;
    this.adminService.getFareSlabs().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.fareSlabs = data.sort((a, b) => a.minStations - b.minStations);
      },
      error: () => this.snackBar.open('Failed to load fare slabs', 'Close', { duration: 3000 })
    });
  }

  openFareDialog(slab?: FareSlab): void {
    const dialogRef = this.dialog.open(FareDialogComponent, {
      width: '400px',
      data: slab || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (slab) {
        // Update existing slab
        this.adminService.updateFareSlab(slab.slabId, result).subscribe({
          next: () => {
            this.snackBar.open('Fare slab updated successfully!', 'Close', { duration: 3000 });
            this.loadFareSlabs();
          },
          error: () => this.snackBar.open('Failed to update slab', 'Close', { duration: 3000 })
        });
      } else {
        // Add new slab
        this.adminService.addFareSlab(result).subscribe({
          next: () => {
            this.snackBar.open('Fare slab added successfully!', 'Close', { duration: 3000 });
            this.loadFareSlabs();
          },
          error: () => this.snackBar.open('Failed to add slab', 'Close', { duration: 3000 })
        });
      }
    });
  }

  onDelete(slab: FareSlab): void {
    if (confirm(`Are you sure you want to delete the slab for ${slab.minStations}-${slab.maxStations} stations?`)) {
      this.adminService.deleteFareSlab(slab.slabId).subscribe({
        next: () => {
          this.snackBar.open('Slab deleted successfully!', 'Close', { duration: 3000 });
          this.loadFareSlabs();
        },
        error: () => this.snackBar.open('Failed to delete slab', 'Close', { duration: 3000 })
      });
    }
  }
}