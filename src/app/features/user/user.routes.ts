import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { BookTicketComponent } from './book-ticket/book-ticket';
import { TicketHistory } from './ticket-history/ticket-history';
import { WalletHistoryComponent } from './wallet-history/wallet-history'; 

export const USER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'book-ticket', component: BookTicketComponent },
  { path: 'ticket-history', component: TicketHistory },
  { path: 'wallet', component: WalletHistoryComponent }, 
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];