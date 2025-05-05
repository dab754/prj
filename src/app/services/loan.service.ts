import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:8080/loans';

  constructor(private http: HttpClient) { }

  getAllLoans(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLoanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createLoan(loan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, loan);
  }

  updateLoan(id: number, loan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLoanHistoryByStatus(freelancerId: number, status?: string): Observable<any[]> {
    let params = new HttpParams().set('freelancerId', freelancerId.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any[]>(`${this.apiUrl}/history`, { params });
  }

  getLoanHistoryByDate(freelancerId: number, startDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('freelancerId', freelancerId.toString())
      .set('startDate', startDate);
    return this.http.get<any[]>(`${this.apiUrl}/history`, { params });
  }

  checkRepaymentData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/repayment-data`);
  }

  makeRepayment(id: number, amount: number): Observable<any> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.post<any>(`${this.apiUrl}/${id}/repay`, null, { params });
  }

  simulateLoan(loanAmount: number, monthlyIncome: number, repaymentRatio: number = 0.3): Observable<any> {
    const params = new HttpParams()
      .set('loanAmount', loanAmount.toString())
      .set('monthlyIncome', monthlyIncome.toString())
      .set('repaymentRatio', repaymentRatio.toString());
    return this.http.get<any>(`${this.apiUrl}/simulate`, { params });
  }

  getRecommendedLoan(income: number): Observable<any> {
    const params = new HttpParams().set('income', income.toString());
    return this.http.get<any>(`${this.apiUrl}/recommend`, { params });
  }

  applyForLoan(income: number, requestedAmount: number): Observable<any> {
    const params = new HttpParams()
      .set('income', income.toString())
      .set('requestedAmount', requestedAmount.toString());
    return this.http.post<any>(`${this.apiUrl}/apply`, null, { params });
  }
}