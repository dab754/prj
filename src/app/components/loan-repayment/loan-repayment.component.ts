
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-repayment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-repayment.component.html',
  styleUrl: './loan-repayment.component.scss'
})
export class LoanRepaymentComponent {
  @Input() loanId!: number;
  repaymentForm: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.repaymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.repaymentForm.valid) {
      const { amount } = this.repaymentForm.value;
      this.loanService.makeRepayment(this.loanId, amount)
        .subscribe({
          next: (response) => {
            this.message = 'Repayment successful';
            this.repaymentForm.reset();
          },
          error: (error) => {
            this.message = 'Error processing repayment';
            console.error('Error:', error);
          }
        });
    }
  }
}
