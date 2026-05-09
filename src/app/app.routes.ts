import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './components/checkout/checkout-page/checkout-page.component';
import { SuccessPageComponent } from './components/checkout/success-page/success-page.component';

export const routes: Routes = [
  {
    path: 'checkout',
    children: [
      { path: '', component: CheckoutPageComponent },
      { path: 'success', component: SuccessPageComponent }
    ]
  },
  { path: '', redirectTo: 'checkout', pathMatch: 'full' },
  { path: '**', redirectTo: 'checkout' }
];
