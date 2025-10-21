import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TokenStorage } from '../../core/services/token-storage';
import { MatTabsModule } from '@angular/material/tabs'; 

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule 
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss']
})
export class AdminLayoutComponent {
  constructor(private tokenStorage: TokenStorage, private router: Router) {}

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/auth/login']);
  }
}