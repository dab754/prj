import { Routes } from '@angular/router';
import { LoanListComponent } from './components/loan-list/loan-list.component';

export const routes: Routes = [
  { path: 'loans', component: LoanListComponent },
  { path: '', redirectTo: '/loans', pathMatch: 'full' }
];
