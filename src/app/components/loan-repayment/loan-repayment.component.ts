import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-repayment',
  templateUrl: './loan-repayment.component.html',
  styleUrls: ['./loan-repayment.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class LoanRepaymentComponent implements OnInit {
  repaymentForm: FormGroup;
  loanId: number;
  freelancerId: number = 1; // Default freelancer ID
  error: string | null = null;
  repaymentData: any;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loanId = +this.route.snapshot.params['id'];
    this.repaymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadRepaymentData();
  }

  loadRepaymentData(): void {
    this.loanService.checkRepaymentData(this.loanId).subscribe({
      next: (data) => {
        this.repaymentData = data;
      },
      error: (err) => {
        this.error = 'Failed to load repayment data. Please try again later.';
        console.error('Error loading repayment data:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.repaymentForm.valid) {
      const amount = this.repaymentForm.get('amount')?.value;
      
      this.loanService.makeRepayment(this.loanId, this.freelancerId, amount).subscribe({
        next: () => {
          this.router.navigate(['/loans']);
        },
        error: (err) => {
          this.error = 'Failed to make repayment. Please try again later.';
          console.error('Error making repayment:', err);
        }
      });
    }
  }
} 