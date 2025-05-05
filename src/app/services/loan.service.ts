
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = '/loans';

  constructor(private http: HttpClient) { }

  // Get all loans
  getAllLoans(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Create a new loan
  createLoan(loan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, loan);
  }

  // Update a loan
  updateLoan(id: number, loan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, loan);
  }

  // Delete a loan
  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get loan history by status
  getLoanHistory(freelancerId: number, status?: string): Observable<any[]> {
    let params = new HttpParams()
      .set('freelancerId', freelancerId.toString());
    
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<any[]>(`${this.apiUrl}/history`, { params });
  }

  // Get loan repayment data
  getRepaymentData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/repayment-data`);
  }

  // Make a repayment
  makeRepayment(id: number, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/repay`, null, {
      params: new HttpParams().set('amount', amount.toString())
    });
  }

  // Simulate loan repayment
  simulateRepayment(loanAmount: number, monthlyIncome: number, repaymentRatio: number = 0.3): Observable<any> {
    const params = new HttpParams()
      .set('loanAmount', loanAmount.toString())
      .set('monthlyIncome', monthlyIncome.toString())
      .set('repaymentRatio', repaymentRatio.toString());

    return this.http.get<any>(`${this.apiUrl}/simulate`, { params });
  }

  // Get loan recommendation
  getLoanRecommendation(income: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recommend`, {
      params: new HttpParams().set('income', income.toString())
    });
  }

  // Apply for loan
  applyForLoan(income: number, requestedAmount: number): Observable<any> {
    const params = new HttpParams()
      .set('income', income.toString())
      .set('requestedAmount', requestedAmount.toString());

    return this.http.post<any>(`${this.apiUrl}/apply`, null, { params });
  }
}
