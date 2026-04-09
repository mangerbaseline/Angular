import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { SuccessPageComponent } from './components/success-page/success-page.component';

export const routes: Routes = [
  { path: '', component: CheckoutPageComponent },
  { path: 'success', component: SuccessPageComponent },
  { path: '**', redirectTo: '' }
];
