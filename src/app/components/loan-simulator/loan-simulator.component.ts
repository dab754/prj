
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-simulator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-simulator.component.html',
  styleUrls: ['./loan-simulator.component.css']
})
export class LoanSimulatorComponent {
  simulatorForm: FormGroup;
  simulationResult: any = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.simulatorForm = this.fb.group({
      loanAmount: ['', [Validators.required, Validators.min(0)]],
      monthlyIncome: ['', [Validators.required, Validators.min(0)]],
      repaymentRatio: [0.3, [Validators.required, Validators.min(0), Validators.max(1)]]
    });
  }

  onSubmit() {
    if (this.simulatorForm.valid) {
      const { loanAmount, monthlyIncome, repaymentRatio } = this.simulatorForm.value;
      this.loanService.simulateLoan(loanAmount, monthlyIncome, repaymentRatio)
        .subscribe({
          next: (result) => {
            this.simulationResult = result;
          },
          error: (error) => {
            console.error('Error simulating loan:', error);
          }
        });
    }
  }
}
