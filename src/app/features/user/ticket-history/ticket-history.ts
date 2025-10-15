import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TicketService } from '../services/ticket';
import { Ticket } from '../models/ticket';

@Component({
  selector: 'app-ticket-history',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterLink,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './ticket-history.html',
  styleUrl: './ticket-history.scss'
})
export class TicketHistory implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.ticketService.getTicketHistory().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load ticket history.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}