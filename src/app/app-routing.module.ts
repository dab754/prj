import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { RepaymentComponent } from './components/repayment/repayment.component';

const routes: Routes = [
  { path: '', redirectTo: '/loans', pathMatch: 'full' },
  { path: 'loans', component: LoanListComponent },
  { 
    path: 'loans/new', 
    loadComponent: () => import('./components/loan-form/loan-form.component').then(m => m.LoanFormComponent)
  },
  { 
    path: 'loans/:id/edit', 
    loadComponent: () => import('./components/loan-form/loan-form.component').then(m => m.LoanFormComponent)
  },
  { path: 'loans/:id', component: LoanDetailsComponent },
  { 
    path: 'loans/:id/repay', 
    loadComponent: () => import('./components/repayment/repayment.component').then(m => m.RepaymentComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 