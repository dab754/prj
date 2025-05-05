
import { Routes } from '@angular/router';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { LoanSimulatorComponent } from './components/loan-simulator/loan-simulator.component';
import { LoanRecommendationComponent } from './components/loan-recommendation/loan-recommendation.component';
import { LoanRepaymentComponent } from './components/loan-repayment/loan-repayment.component';

export const routes: Routes = [
  { path: 'loans', component: LoanListComponent },
  { path: 'loans/new', component: LoanFormComponent },
  { path: 'loans/:id/edit', component: LoanFormComponent },
  { path: 'simulator', component: LoanSimulatorComponent },
  { path: 'recommendation', component: LoanRecommendationComponent },
  { path: 'repayment', component: LoanRepaymentComponent },
  { path: '', redirectTo: '/loans', pathMatch: 'full' }
];
