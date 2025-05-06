import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:8082/loans';

  constructor(private http: HttpClient) { }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  createLoan(loan: Loan): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  updateLoan(id: number, loan: Loan): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLoanHistory(freelancerId: number, status?: string, startDate?: string): Observable<Loan[]> {
    let params = new HttpParams().set('freelancerId', freelancerId.toString());
    if (status) {
      params = params.set('status', status);
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    return this.http.get<Loan[]>(`${this.apiUrl}/history`, { params });
  }

  checkRepaymentData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/repayment-data`);
  }

  makeRepayment(id: number, freelancerId: number, amount: number): Observable<any> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('freelancerId', freelancerId.toString());
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

  applyForLoan(income: number, requestedAmount: number): Observable<string> {
    const params = new HttpParams()
      .set('income', income.toString())
      .set('requestedAmount', requestedAmount.toString());
    return this.http.post<string>(`${this.apiUrl}/apply`, null, { params });
  }
}
