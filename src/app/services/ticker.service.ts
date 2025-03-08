import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TickerData } from '../models/ticker.model';

@Injectable({
  providedIn: 'root'
})
export class TickerService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getBtcTicker(interval: string, limit: number): Observable<TickerData[]> {
    const url = `${this.baseUrl}/ticker/btcusd/${interval}/${limit}`;
    return this.http.get<TickerData[]>(url);
  }

  getEthTicker(interval: string, limit: number): Observable<TickerData[]> {
    const url = `${this.baseUrl}/ticker/ethusd/${interval}/${limit}`;
    return this.http.get<TickerData[]>(url);
  }
}
