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
  styleUrls: ['./ticket-history.scss']
})
export class TicketHistory implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;
  cancellingTicketId: number | null = null;

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTicketHistory();
  }

  loadTicketHistory(): void {
    this.isLoading = true;
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

  onCancelTicket(ticketId: number, event: Event): void {
    event.stopPropagation(); // Prevent the expansion panel from toggling
    
    if (!confirm('Are you sure you want to cancel this ticket? The fare will be refunded to your wallet.')) {
      return;
    }

    this.cancellingTicketId = ticketId;
    this.ticketService.cancelTicket(ticketId).subscribe({
      next: (updatedTicket) => {
        // Find the ticket in the local array and update its status
        const index = this.tickets.findIndex(t => t.ticketId === ticketId);
        if (index > -1) {
          this.tickets[index] = { ...this.tickets[index], status: updatedTicket.status };
        }
        this.snackBar.open('Ticket cancelled successfully. Refund has been processed to your wallet.', 'Close', { duration: 5000 });
        this.cancellingTicketId = null;
      },
      error: (err) => {
        const errorMessage = err.error?.error?.message || 'Failed to cancel the ticket.';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        this.cancellingTicketId = null;
      }
    });
  }
}