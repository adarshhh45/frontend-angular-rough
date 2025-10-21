import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ValidationResponse } from './validation';

// Define the key we'll use in sessionStorage
const STORAGE_KEY = 'recentValidations';

// We'll enrich the response with a client-side timestamp for sorting
export interface EnrichedValidationResponse extends ValidationResponse {
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StaffDataService {
  private recentValidationsSubject: BehaviorSubject<EnrichedValidationResponse[]>;
  
  public recentValidations$: Observable<EnrichedValidationResponse[]>

  constructor() {
    // 1. LOAD DATA ON INITIALIZATION
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    let initialData: EnrichedValidationResponse[] = [];
    
    if (savedData) {
      try {
        // Parse the saved JSON and convert date strings back to Date objects
        const parsedData = JSON.parse(savedData);
        initialData = parsedData.map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp) 
        }));
      } catch (e) {
        console.error("Error parsing validation data from sessionStorage", e);
        initialData = [];
      }
    }
    
    this.recentValidationsSubject = new BehaviorSubject<EnrichedValidationResponse[]>(initialData);
    this.recentValidations$ = this.recentValidationsSubject.asObservable();
  }

  /**
   * Adds a new validation result to the list.
   */
  addValidation(validationResult: ValidationResponse): void {
    const currentValidations = this.recentValidationsSubject.getValue();
    
    const newValidation: EnrichedValidationResponse = {
      ...validationResult,
      timestamp: new Date()
    };

    const updatedValidations = [newValidation, ...currentValidations];

    if (updatedValidations.length > 5) {
      updatedValidations.pop();
    }
    
    // Push the updated list to subscribers
    this.recentValidationsSubject.next(updatedValidations);
    
    // 2. SAVE THE UPDATED LIST TO SESSIONSTORAGE
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedValidations));
  }
}