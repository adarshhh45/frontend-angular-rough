import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

//model for station dto
export interface Station {
  stationId: number;
  name: string;
  code: string;
  stationOrder: number; 
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StationService {
  //assuming a public endpoint exists to get all active stations
  private apiUrl = `${environment.apiUrl}/stations`;

  constructor(private http: HttpClient) { }

  // In a real app, this might be `/api/v1/stations` (a public endpoint)
  getAllStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.apiUrl);
  }
}