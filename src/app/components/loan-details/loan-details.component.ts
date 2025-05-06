import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  loan: Loan | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLoanDetails(Number(id));
    }
  }

  loadLoanDetails(id: number): void {
    this.loanService.getLoanById(id).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load loan details. Please try again later.';
        console.error('Error loading loan details:', err);
      }
    });
  }
} 