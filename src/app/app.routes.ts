import { Routes } from '@angular/router';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanSimulatorComponent } from './components/loan-simulator/loan-simulator.component';
import { LoanRecommendationComponent } from './components/loan-recommendation/loan-recommendation.component';

export const routes: Routes = [
  { path: 'loans', component: LoanListComponent },
  { 
    path: 'loans/new', 
    loadComponent: () => import('./components/loan-form/loan-form.component').then(m => m.LoanFormComponent)
  },
  { 
    path: 'loans/:id/edit', 
    loadComponent: () => import('./components/loan-form/loan-form.component').then(m => m.LoanFormComponent)
  },
  { 
    path: 'loans/:id/repay', 
    loadComponent: () => import('./components/loan-repayment/loan-repayment.component').then(m => m.LoanRepaymentComponent)
  },
  { path: 'simulator', component: LoanSimulatorComponent },
  { path: 'recommendation', component: LoanRecommendationComponent },
  { path: '', redirectTo: '/loans', pathMatch: 'full' }
];
