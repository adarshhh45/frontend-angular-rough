import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TicketService } from '../services/ticket';
import { Ticket } from '../models/ticket';

import { jsPDF } from 'jspdf';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-ticket-history',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [
    DatePipe,  
    CurrencyPipe   
  ],
  templateUrl: './ticket-history.html',
  styleUrls: ['./ticket-history.scss']
})
export class TicketHistory implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;
  cancellingTicketId: number | null = null;
   downloadingTicketId: number | null = null;

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.loadTicketHistory();
  }

  getStatusIcon(status: string): string {
  const iconMap: { [key: string]: string } = {
    'CONFIRMED': 'check_circle',
    'IN_TRANSIT': 'sync',
    'USED': 'done_all',
    'EXPIRED': 'schedule',
    'CANCELLED': 'cancel'
  };
  return iconMap[status] || 'info';
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
    event.stopPropagation(); 
    
    if (!confirm('Are you sure you want to cancel this ticket? The fare will be refunded to your wallet.')) {
      return;
    }

    this.cancellingTicketId = ticketId;
    this.ticketService.cancelTicket(ticketId).subscribe({
      next: (updatedTicket) => {
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
  onDownloadTicketPdf(ticket: Ticket, event: Event): void {
    event.stopPropagation();
    this.downloadingTicketId = ticket.ticketId;

    try {
      const doc = new jsPDF();

      // 1. Add Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Metro E-Ticket', 105, 20, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(15, 25, 195, 25);

      // 2. Add Journey Details
      doc.setFontSize(16);
      doc.text(`${ticket.originStationName} to ${ticket.destinationStationName}`, 15, 40);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      // 3. Add Ticket Info
      const bookingTime = this.datePipe.transform(ticket.bookingTime, 'medium');
      const expiryTime = this.datePipe.transform(ticket.expiryTime, 'medium');
      const fare = this.currencyPipe.transform(ticket.fare, 'INR');

      doc.text(`Ticket ID: ${ticket.ticketNumber}`, 15, 55);
      doc.text(`Fare: ${fare}`, 15, 65);
      doc.text(`Type: ${ticket.ticketType.replace('_', ' ')}`, 15, 75);
      doc.text(`Booked On: ${bookingTime}`, 15, 85);
      doc.text(`Expires On: ${expiryTime}`, 15, 95);

      // 4. Add QR Code
      doc.setFont('helvetica', 'bold');
      doc.text('Your QR Code', 155, 50, { align: 'center' });
      const qrImage = `data:image/png;base64,${ticket.qrCodeImage}`;
      doc.addImage(qrImage, 'PNG', 125, 55, 60, 60);

      // 5. Add Footer
      doc.line(15, 125, 195, 125);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Please show this QR code at the entry and exit gates.', 105, 135, { align: 'center' });

      // 6. Save the PDF
      doc.save(`ticket-${ticket.ticketNumber}.pdf`);

    } catch (error) {
      this.snackBar.open('Failed to generate PDF ticket.', 'Close', { duration: 3000 });
    } finally {
      this.downloadingTicketId = null;
    }
  }
}