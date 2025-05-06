import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-repayment',
  templateUrl: './repayment.component.html',
  styleUrls: ['./repayment.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class RepaymentComponent implements OnInit {
  repaymentForm: FormGroup;
  loanId: number | null = null;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.repaymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      freelancerId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loanId = +params['id'];
    });
  }

  onSubmit(): void {
    if (this.repaymentForm.valid && this.loanId) {
      const { amount, freelancerId } = this.repaymentForm.value;
      
      this.loanService.makeRepayment(this.loanId, freelancerId, amount).subscribe({
        next: () => {
          this.success = 'Repayment successful!';
          this.error = null;
          setTimeout(() => {
            this.router.navigate(['/loans']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error || 'Failed to process repayment. Please try again later.';
          this.success = null;
          console.error('Error processing repayment:', err);
        }
      });
    }
  }
} 