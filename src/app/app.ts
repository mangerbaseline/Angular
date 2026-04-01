import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundAnimationComponent } from './components/background-animation/background-animation.component';
import { BrandHeaderComponent } from './components/brand-header/brand-header.component';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { VisualDisplayComponent } from './components/visual-display/visual-display.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BackgroundAnimationComponent,
    BrandHeaderComponent,
    PaymentCardComponent,
    VisualDisplayComponent
  ],
  templateUrl: './app.html',
  styles: [`
    .app-container {
      width: 100vw;
      min-height: 100vh;
      display: flex;
      overflow-y: auto;
      overflow-x: hidden;
      color: #fff;
      font-family: 'Inter', sans-serif;
      position: relative;
    }

    .visual-panel {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end; /* Push to center line */
      padding: 40px 140px 40px 40px; /* Increased space from center line */
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
      align-items: flex-start; /* Push to center line */
      padding: 40px 40px 40px 140px; /* Increased space from center line */
      position: relative;
      min-height: 100vh;
  
      background: rgba(0, 0, 0, 0.1);
    }

    .form-glass-card {
      width: 100%;
      max-width: 500px; /* Increased from 420px */
      background: transparent;
      border: none;
      box-shadow: none;
      overflow: visible;
    }

    .global-footer {
      position: absolute;
      bottom: 0px;
      left: 10%;
      right: 20%;
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      font-size: 11px;
      color: #334155;
      font-weight: 500;
      z-index: 5;
      pointer-events: none;
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

    @media (max-width: 1100px) {
      .global-footer {
        position: static;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        text-align: center;
        padding: 40px 20px;
      }
      .gf-left, .gf-right {
        max-width: 100%;
        text-align: center;
      }
    }

    @media (max-width: 860px) {
      .app-container {
        flex-direction: column;
        height: auto;
        min-height: 100vh;
      }
      .visual-panel {
        min-height: 45vh;
        width: 100%;
        padding: 32px 16px;
        justify-content: center;
      }
      .form-panel {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: auto;
        padding: 32px 16px;
        align-items: center;
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: none;
      }
    }
  `],
})
export class App {
  title = 'angularpaymentui';
  selectedMethod = signal('card');

  onMethodChange(method: string) {
    this.selectedMethod.set(method);
  }
}
