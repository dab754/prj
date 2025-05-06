import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  error: string | null = null;

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getAllLoans().subscribe({
      next: (data) => {
        this.loans = data;
      },
      error: (error) => {
        console.error('Error fetching loans:', error);
        this.error = 'Failed to load loans. Please try again later.';
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this loan?')) {
      this.loanService.deleteLoan(id).subscribe({
        next: () => {
          this.loans = this.loans.filter(loan => loan.id !== id);
        },
        error: (error) => {
          console.error('Error deleting loan:', error);
          this.error = 'Failed to delete loan. Please try again later.';
        }
      });
    }
  }
}
