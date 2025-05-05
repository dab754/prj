import { Routes } from '@angular/router';
import { LoanListComponent } from './components/loan-list/loan-list.component';

import { LoanFormComponent } from './components/loan-form/loan-form.component';

export const routes: Routes = [
  { path: 'loans', component: LoanListComponent },
  { path: 'loans/new', component: LoanFormComponent },
  { path: 'loans/edit/:id', component: LoanFormComponent },
  { path: '', redirectTo: '/loans', pathMatch: 'full' }
];
