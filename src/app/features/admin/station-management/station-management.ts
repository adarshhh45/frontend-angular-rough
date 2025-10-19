import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminService } from '../services/admin';
import { Station } from '../../user/services/station';
import { StationDialogComponent } from '../station-dialog/station-dialog';

@Component({
  selector: 'app-station-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './station-management.html',
  styleUrls: ['./station-management.scss']
})
export class StationManagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'code', 'order', 'status', 'actions'];
  stations: Station[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.adminService.getStations().subscribe({
      next: (data) => {
        this.stations = data;
      },
      error: (err) => {
        this.snackBar.open('Failed to load stations', 'Close', { duration: 3000 });
      }
    });
  }

  openStationDialog(station?: Station): void {
    const dialogRef = this.dialog.open(StationDialogComponent, {
      width: '400px',
      data: station || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (station) {
          this.adminService.updateStation(station.stationId, result).subscribe({
            next: () => {
              this.snackBar.open('Station updated successfully!', 'Close', { duration: 3000 });
              this.loadStations();
            },
            error: () => this.snackBar.open('Failed to update station', 'Close', { duration: 3000 })
          });
        } else {
          this.adminService.addStation(result).subscribe({
            next: () => {
              this.snackBar.open('Station added successfully!', 'Close', { duration: 3000 });
              this.loadStations();
            },
            error: () => this.snackBar.open('Failed to add station', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  toggleStationStatus(id: number, activate: boolean): void {
      const action = activate ? this.adminService.activateStation(id) : this.adminService.deactivateStation(id);
      const message = activate ? 'activated' : 'deactivated';

      action.subscribe({
          next: () => {
              this.snackBar.open(`Station ${message} successfully!`, 'Close', { duration: 3000 });
              this.loadStations();
          },
          error: () => this.snackBar.open(`Failed to ${message} station`, 'Close', { duration: 3000 })
      });
  }
}