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
      <div class="visual-panel">
        <app-visual-display [selectedMethod]="selectedMethod()" [cardType]="cardType()"></app-visual-display>
      </div>

      <div class="form-panel">
        <div class="form-glass-card">
          <app-payment-card 
            (methodChange)="onMethodChange($event)" 
            (cardTypeChange)="onCardTypeChange($event)"
            (paymentSuccess)="onPaymentSuccess()">
          </app-payment-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
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
    }

    .form-glass-card {
      width: 100%;
      max-width: 500px;
      background: transparent;
      border: none;
      box-shadow: none;
      overflow: visible;
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

  constructor(private router: Router) {}

  onMethodChange(method: string) {
    this.selectedMethod.set(method);
  }

  onCardTypeChange(type: string) {
    this.cardType.set(type);
  }

  onPaymentSuccess() {
    this.router.navigate(['/success']);
  }
}
