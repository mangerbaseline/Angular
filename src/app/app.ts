import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackgroundAnimationComponent } from './components/background-animation/background-animation.component';
import { BrandHeaderComponent } from './components/brand-header/brand-header.component';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { VisualDisplayComponent } from './components/visual-display/visual-display.component';
import { SuccessPageComponent } from './components/success-page/success-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BackgroundAnimationComponent,
    BrandHeaderComponent,
    PaymentCardComponent,
    VisualDisplayComponent,
    SuccessPageComponent
  ],
  templateUrl: './app.html',
  styles: [`
    .app-container {
      width: 100vw;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      color: #fff;
      font-family: 'Inter', sans-serif;
      position: relative;
    }

    .checkout-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }

    .success-layout {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 50;
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

    .global-footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 40px 80px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.3);
      font-weight: 500;
      z-index: 5;
      margin-top: auto;
    }

    .gf-left {
      max-width: 300px;
      line-height: 1.5;
    }

    .gf-right {
      text-align: right;
    }

    .gf-right strong {
      color: #475569;
    }

    @media (max-width: 1300px) {
      .visual-panel { padding: 40px 60px 40px 40px; }
      .form-panel { padding: 40px 40px 40px 60px; }
      .global-footer { padding: 40px 40px; }
    }

    @media (max-width: 1100px) {
      .global-footer {
        flex-direction: column;
        align-items: center;
        gap: 12px;
        text-align: center;
      }
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
  `],
})
export class App {
  title = 'angularpaymentui';
  selectedMethod = signal('card');
  cardType = signal('visa');

  paymentSuccess = signal(false);

  onMethodChange(method: string) {
    this.selectedMethod.set(method);
  }

  onCardTypeChange(type: string) {
    this.cardType.set(type);
  }

  onPaymentSuccess() {
    this.paymentSuccess.set(true);
  }

  onReturnToCheckout() {
    this.paymentSuccess.set(false);
  }
}
