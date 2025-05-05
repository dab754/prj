
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Router } from '@angular/router';

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
  statuses = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      purpose: ['', Validators.required],
      status: ['PENDING', Validators.required],
      freelancerId: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.loanId) {
      this.loanService.getLoanById(this.loanId).subscribe(
        loan => {
          this.loanForm.patchValue({
            amount: loan.amount,
            purpose: loan.purpose,
            status: loan.status,
            freelancerId: loan.freelancer.id
          });
        }
      );
    }
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const formData = {
        ...this.loanForm.value,
        freelancer: { id: this.loanForm.value.freelancerId }
      };
      
      if (this.loanId) {
        this.loanService.updateLoan(this.loanId, formData).subscribe({
          next: () => {
            this.router.navigate(['/loans']);
          },
          error: (error) => console.error('Error updating loan:', error)
        });
      } else {
        this.loanService.createLoan(formData).subscribe({
          next: () => {
            this.router.navigate(['/loans']);
          },
          error: (error) => console.error('Error creating loan:', error)
        });
      }
    }
  }
}
