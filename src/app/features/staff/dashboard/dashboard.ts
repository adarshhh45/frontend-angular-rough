import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { StaffDataService, EnrichedValidationResponse } from '../services/staff-data.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule, // Add FormsModule for ngModel
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonToggleModule // Add MatButtonToggleModule for the filters
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class StaffDashboardComponent implements OnInit {
  // Properties for stats
  ticketsValidatedToday = 0;
  successfulScans = 0;
  failedScans = 0;

  // Observables for validations
  private recentValidations$!: Observable<EnrichedValidationResponse[]>;
  filteredValidations$!: Observable<EnrichedValidationResponse[]>;
  
  // Filter state management
  private filterSubject = new BehaviorSubject<'all' | 'successful' | 'failed'>('all');
  filter$ = this.filterSubject.asObservable();
  currentFilter: 'all' | 'successful' | 'failed' = 'all';

  @ViewChild('recentValidationsSection') recentValidationsSection!: ElementRef;

  constructor(private staffDataService: StaffDataService) {}

  ngOnInit(): void {
    this.recentValidations$ = this.staffDataService.recentValidations$;

    // Update stats whenever the source data changes
    this.recentValidations$.subscribe(validations => {
      this.updateStats(validations);
    });

    // Create a filtered observable that reacts to both data and filter changes
    this.filteredValidations$ = combineLatest([
      this.recentValidations$,
      this.filter$
    ]).pipe(
      map(([validations, filter]) => {
        if (filter === 'all') {
          return validations;
        }
        return validations.filter(v => filter === 'successful' ? v.valid : !v.valid);
      })
    );
  }

  private updateStats(validations: EnrichedValidationResponse[]): void {
    const today = new Date().toDateString();
    const todayValidations = validations.filter(v => new Date(v.timestamp).toDateString() === today);

    this.ticketsValidatedToday = todayValidations.length;
    this.successfulScans = todayValidations.filter(v => v.valid).length;
    this.failedScans = todayValidations.filter(v => !v.valid).length;
  }

  setFilter(filter: 'all' | 'successful' | 'failed'): void {
    this.currentFilter = filter;
    this.filterSubject.next(filter);

    // If "Review Issues" is clicked, scroll to the relevant section
    if (filter === 'failed') {
      this.recentValidationsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}