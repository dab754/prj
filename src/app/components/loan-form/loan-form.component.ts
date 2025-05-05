
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.css']
})
export class LoanFormComponent implements OnInit {
  @Input() loanId?: number;
  loanForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.loanForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      purpose: ['', Validators.required],
      freelancerId: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.loanId) {
      // Load existing loan data if editing
      this.loanService.getLoanById(this.loanId).subscribe(
        loan => {
          this.loanForm.patchValue({
            amount: loan.amount,
            purpose: loan.purpose,
            freelancerId: loan.freelancer.id
          });
        }
      );
    }
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;
      
      if (this.loanId) {
        this.loanService.updateLoan(this.loanId, loanData).subscribe({
          next: () => {
            console.log('Loan updated successfully');
            this.loanForm.reset();
          },
          error: (error) => console.error('Error updating loan:', error)
        });
      } else {
        this.loanService.createLoan(loanData).subscribe({
          next: () => {
            console.log('Loan created successfully');
            this.loanForm.reset();
          },
          error: (error) => console.error('Error creating loan:', error)
        });
      }
    }
  }
}
