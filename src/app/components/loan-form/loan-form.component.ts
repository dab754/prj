import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class LoanFormComponent implements OnInit {
  loanForm: FormGroup;
  isEditMode = false;
  loanId: number | null = null;
  error: string | null = null;
  loanPurposes = [
    'Business Expansion',
    'Equipment Purchase',
    'Inventory',
    'Working Capital',
    'Marketing',
    'Rent',
    'Utilities',
    'Salary',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      purpose: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      status: ['PENDING'],
      requestDate: [new Date().toISOString().split('T')[0]],
      paidAmount: [0],
      remainingAmount: [0],
      freelancer: this.fb.group({
        id: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.loanId = +params['id'];
        this.loadLoanDetails(this.loanId);
      }
    });
  }

  loadLoanDetails(id: number): void {
    this.loanService.getLoanById(id).subscribe({
      next: (loan) => {
        this.loanForm.patchValue({
          amount: loan.amount,
          purpose: loan.purpose,
          description: loan.description,
          dueDate: loan.dueDate,
          status: loan.status,
          requestDate: loan.requestDate,
          paidAmount: loan.paidAmount,
          remainingAmount: loan.remainingAmount,
          freelancer: {
            id: loan.freelancer.id
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load loan details. Please try again later.';
        console.error('Error loading loan details:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;
      loanData.remainingAmount = loanData.amount; // Set remaining amount equal to amount for new loans
      
      if (this.isEditMode && this.loanId) {
        this.loanService.updateLoan(this.loanId, loanData).subscribe({
          next: () => {
            this.router.navigate(['/loans']);
          },
          error: (err) => {
            this.error = 'Failed to update loan. Please try again later.';
            console.error('Error updating loan:', err);
          }
        });
      } else {
        this.loanService.createLoan(loanData).subscribe({
          next: () => {
            this.router.navigate(['/loans']);
          },
          error: (err) => {
            this.error = 'Failed to create loan. Please try again later.';
            console.error('Error creating loan:', err);
          }
        });
      }
    }
  }

  get freelancerIdControl(): FormControl {
    return this.loanForm.get('freelancer.id') as FormControl;
  }
}
