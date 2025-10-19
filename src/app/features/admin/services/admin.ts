import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Station } from '../../user/services/station'; 

export interface CreateStationRequest {
  name: string;
  code: string;
  stationOrder: number;
}
export interface FareSlab {
  slabId: number;
  minStations: number;
  maxStations: number;
  fare: number;
}
export interface CreateFareSlabRequest {
  minStations: number;
  maxStations: number;
  fare: number;
}
export interface SalesReport {
  startDate: string;
  endDate: string;
  totalTicketsSold: number;
  totalRevenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.adminApiUrl}/stations/all`);
  }

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

  getFareSlabs(): Observable<FareSlab[]> {
    return this.http.get<FareSlab[]>(`${this.adminApiUrl}/fares/slabs`);
  }

  addFareSlab(slabData: CreateFareSlabRequest): Observable<FareSlab> {
    return this.http.post<FareSlab>(`${this.adminApiUrl}/fares/slabs`, slabData);
  }

  updateFareSlab(id: number, slabData: CreateFareSlabRequest): Observable<FareSlab> {
    return this.http.put<FareSlab>(`${this.adminApiUrl}/fares/slabs/${id}`, slabData);
  }

  deleteFareSlab(id: number): Observable<any> {
    return this.http.delete(`${this.adminApiUrl}/fares/slabs/${id}`);
  }
   getSalesReport(from: string, to: string): Observable<SalesReport> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<SalesReport>(`${this.adminApiUrl}/reports/sales`, { params });
  }
}