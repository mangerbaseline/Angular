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
            <h1 class="error-title">URL Broken</h1>
            <p class="error-message">The payment link you followed is invalid or has expired. Please contact the merchant for a new link.</p>
            <div class="error-footer">
              Error: Invalid Decryption Token
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
      position: relative;
    }

    .visual-panel {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 40px 140px 40px 40px;
      z-index: 10;
      overflow: hidden;
    }

    .form-panel {
      flex: 1;
      min-width: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 40px 40px 140px;
      position: relative;
      min-height: 100vh;
      background: rgba(0, 0, 0, 0.1);
      transition: all 0.5s ease;
    }

    .form-glass-card {
      width: 100%;
      max-width: 500px;
      background: transparent;
      border: none;
      box-shadow: none;
      overflow: visible;
    }

    /* ERROR STATE STYLES */
    .error-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .error-glass-card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 24px;
      padding: 48px 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      width: 100%;
    }

    .error-icon-wrap {
      width: 80px;
      height: 80px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
    }

    .error-title {
      font-size: 32px;
      font-weight: 800;
      color: #f1f5f9;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .error-message {
      font-size: 16px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 32px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .error-footer {
      font-size: 12px;
      font-family: monospace;
      color: rgba(239, 68, 68, 0.6);
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      display: inline-block;
    }

    .fade-in {
      animation: fadeInAnim 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeInAnim {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .anim-fade-in {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1300px) {
      .visual-panel { padding: 40px 60px 40px 40px; }
      .form-panel { padding: 40px 40px 40px 60px; }
    }

    @media (max-width: 860px) {
      .checkout-layout {
        flex-direction: column;
        height: auto;
      }
      .visual-panel { display: none; }
      .form-panel {
        width: 100%;
        padding: 30px 20px;
        align-items: center;
      }
    }
  `]
})
export class CheckoutPageComponent {
  selectedMethod = signal('card');
  cardType = signal('visa');
  totalAmount = signal(0);
  hasTokenError = signal(false);

  constructor(private router: Router) {}

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
    this.router.navigate(['/success']);
  }

  onTokenError(isError: boolean) {
    this.hasTokenError.set(isError);
  }
}
