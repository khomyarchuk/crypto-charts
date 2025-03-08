import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profit } from '../models/profit.model';
import { ProfitPeriod } from '../models/profit-period.model';

@Injectable({
  providedIn: 'root'
})
export class ProfitService {
  private apiUrl = 'http://localhost:8081/profits';

  constructor(private http: HttpClient) {}

  getProfits(): Observable<Profit[]> {
    return this.http.get<Profit[]>(this.apiUrl);
  }

  getProfit(profitId: number): Observable<Profit> {
    return this.http.get<Profit>(`${this.apiUrl}/${profitId}`);
  }

  createProfit(name: string): Observable<Profit> {
    return this.http.post<Profit>(this.apiUrl, { name });
  }

  deleteProfit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProfitPeriod(
    profitId: number,
    periodId: number,
    period: Omit<ProfitPeriod, 'id'>
  ): Observable<ProfitPeriod> {
    return this.http.put<ProfitPeriod>(`${this.apiUrl}/${profitId}/periods/${periodId}`, period);
  }

  addProfitPeriod(profitId: number, period: ProfitPeriod): Observable<ProfitPeriod> {
    return this.http.post<ProfitPeriod>(`${this.apiUrl}/${profitId}/periods`, period);
  }

  deleteProfitPeriod(profitId: number, periodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${profitId}/periods/${periodId}`);
  }
}
