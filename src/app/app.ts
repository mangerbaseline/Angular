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

    @media (max-width: 1300px) {
      .visual-panel {
        padding: 40px 60px 40px 40px;
      }
      .form-panel {
        padding: 40px 40px 40px 60px;
      }
      .global-footer {
        left: 5%;
        right: 10%;
      }
    }

    /* Nest Hub / Landscape Tablet / Small Laptop Fixes */
    @media (max-width: 1050px) and (min-width: 860px) {
      .visual-panel {
        padding: 20px 30px 20px 30px !important;
      }
      .form-panel {
        padding: 20px 30px 20px 30px !important;
      }
      .form-glass-card {
        max-width: 440px;
      }
    }

    @media (max-height: 700px) and (min-width: 860px) {
      .visual-panel, .form-panel {
        padding-top: 10px !important;
        padding-bottom: 30px !important;
        min-height: auto;
      }
      .global-footer {
        display: none; /* Hide on very short landscape screens to save space */
      }
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
        display: none;
      }
      .form-panel {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: auto;
        padding: 15px 0px;
        align-items: center;
        border-left: none;
        box-shadow: none;
      }
    }
  `],
})
export class App {
  title = 'angularpaymentui';
  selectedMethod = signal('card');
  cardType = signal('visa');

  onMethodChange(method: string) {
    this.selectedMethod.set(method);
  }

  onCardTypeChange(type: string) {
    this.cardType.set(type);
  }
}
