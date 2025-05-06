import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-recommendation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './loan-recommendation.component.html',
  styleUrls: ['./loan-recommendation.component.css']
})
export class LoanRecommendationComponent {
  recommendationForm: FormGroup;
  recommendation: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.recommendationForm = this.fb.group({
      income: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.recommendationForm.valid) {
      const { income } = this.recommendationForm.value;
      this.loanService.getRecommendedLoan(income)
        .subscribe({
          next: (result) => {
            this.recommendation = result.message;
          },
          error: (error) => {
            console.error('Error getting loan recommendation:', error);
            this.recommendation = 'Error getting loan recommendation. Please try again.';
          }
        });
    }
  }
}
