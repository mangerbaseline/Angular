import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { VisualDisplayComponent } from '../visual-display/visual-display.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, PaymentCardComponent, VisualDisplayComponent],
  template: `
    <div class="checkout-layout anim-fade-in">
      <div class="visual-panel" *ngIf="!hasTokenError()">
        <app-visual-display [selectedMethod]="selectedMethod()" [cardType]="cardType()" [totalAmount]="totalAmount()"></app-visual-display>
      </div>

      <div class="form-panel" [style.background]="hasTokenError() ? 'transparent' : ''" [style.align-items]="hasTokenError() ? 'center' : 'flex-start'" [style.padding]="hasTokenError() ? '40px' : ''">
        <div class="form-glass-card" *ngIf="!hasTokenError()">
          <app-payment-card 
            (methodChange)="onMethodChange($event)" 
            (cardTypeChange)="onCardTypeChange($event)"
            (totalAmountChange)="onTotalAmountChange($event)"
            (paymentSuccess)="onPaymentSuccess()"
            (tokenErrorEvent)="onTokenError($event)">
          </app-payment-card>
        </div>

        <!-- ERROR STATE -->
        <div *ngIf="hasTokenError()" class="error-container fade-in">
          <div class="error-glass-card">
            <div class="error-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h1 class="error-title">This link no longer active</h1>
            <!-- <p class="error-message">The payment link you followed is invalid or has expired. Please contact the merchant for a new link.</p> -->
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent {
  selectedMethod = signal('card');
  cardType = signal('visa');
  totalAmount = signal(0);
  hasTokenError = signal(false);

  constructor(private router: Router) { }

  onMethodChange(method: string) {
    this.selectedMethod.set(method);
  }

  onCardTypeChange(type: string) {
    this.cardType.set(type);
  }

  onTotalAmountChange(amount: number) {
    this.totalAmount.set(amount);
  }

  onPaymentSuccess() {
    this.router.navigate(['/success'], { queryParamsHandling: 'preserve' });
  }

  onTokenError(isError: boolean) {
    this.hasTokenError.set(isError);
  }
}
