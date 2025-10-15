import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Station } from '../../user/services/station'; // We can reuse this interface

export interface CreateStationRequest {
  name: string;
  code: string;
  stationOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = `${environment.apiUrl}/admin`;
  // No longer need the publicApiUrl here

  constructor(private http: HttpClient) { }

  // Method to get all stations for the admin view
  getStations(): Observable<Station[]> {
    // --- CHANGE THIS URL ---
    return this.http.get<Station[]>(`${this.adminApiUrl}/stations/all`);
  }

  // ... rest of the service methods are correct ...
  addStation(stationData: CreateStationRequest): Observable<Station> {
    return this.http.post<Station>(`${this.adminApiUrl}/stations`, stationData);
  }

  updateStation(id: number, stationData: CreateStationRequest): Observable<Station> {
    return this.http.put<Station>(`${this.adminApiUrl}/stations/${id}`, stationData);
  }

  deactivateStation(id: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/stations/${id}/deactivate`, {});
  }

  activateStation(id: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/stations/${id}/activate`, {});
  }
}