
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  loans: any[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (data) => {
        this.loans = data;
      },
      (error) => {
        console.error('Error fetching loans:', error);
      }
    );
  }

  onEdit(id: number): void {
    // TODO: Implement edit functionality
    console.log('Edit loan:', id);
  }

  onDelete(id: number): void {
    this.loanService.deleteLoan(id).subscribe(
      () => {
        this.loans = this.loans.filter(loan => loan.id !== id);
      },
      (error) => {
        console.error('Error deleting loan:', error);
      }
    );
  }

  onDetails(id: number): void {
    // TODO: Implement details functionality
    console.log('View details for loan:', id);
  }
}
