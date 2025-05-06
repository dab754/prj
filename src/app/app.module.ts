import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { RepaymentComponent } from './components/repayment/repayment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoanListComponent,
    LoanDetailsComponent,
    RepaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 