import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visual-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visual-container">

      <!-- Dynamic outer glow reacts to payment method -->
      <div class="glow-orb" [style.background]="getGlowColor()"></div>

      <!-- Main 3D Floating Visual -->
      <div class="main-visual" [ngSwitch]="selectedMethod">

        <!-- CARD -->
        <div *ngSwitchCase="'card'" class="card-3d fade-in">
          <div class="card-shine"></div>
          <div class="card-top">
            <div class="chip">
              <div class="chip-line"></div>
              <div class="chip-line"></div>
              <div class="chip-line"></div>
            </div>
            <div class="network-logo">
              <div class="circle-red"></div>
              <div class="circle-orange"></div>
            </div>
          </div>
          <div class="card-number">•••• •••• •••• 4582</div>
          <div class="card-bottom">
            <span class="cardholder">Alex Johnson</span>
            <span class="expiry">12/28</span>
          </div>
        </div>

        <!-- APPLE PAY -->
        <div *ngSwitchCase="'apple'" class="phone-3d fade-in">
          <div class="phone-notch"></div>
          <div class="phone-screen-inner">
            <svg viewBox="0 0 24 24" class="apple-icon" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
              <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="apple-pay-text">Pay</div>
            <div class="face-id">
              <div class="fi-dot tl"></div><div class="fi-dot tr"></div>
              <div class="fi-dot bl"></div><div class="fi-dot br"></div>
              <div class="fi-line"></div>
            </div>
          </div>
          <div class="phone-home-bar"></div>
        </div>

        <!-- GOOGLE PAY -->
        <div *ngSwitchCase="'google'" class="gpay-card fade-in">
          <div class="gpay-logo">
            <span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span>
          </div>
          <div class="gpay-text">Pay</div>
          <div class="nfc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32">
              <path d="M13 2.05A10 10 0 0 1 22 12a10 10 0 0 1-9 9.95"/>
              <path d="M9 2.31a10 10 0 0 0-6.95 12.15A10 10 0 0 0 9 21.7"/>
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>
            </svg>
          </div>
        </div>

        <!-- BANK -->
        <div *ngSwitchCase="'bank'" class="bank-visual fade-in">
          <svg viewBox="0 0 64 64" class="bank-icon" fill="none" stroke="#10b981" stroke-width="1.5">
            <rect x="8" y="52" width="48" height="4" rx="2"/>
            <rect x="4" y="24" width="56" height="4" rx="2"/>
            <rect x="10" y="28" width="6" height="24"/>
            <rect x="22" y="28" width="6" height="24"/>
            <rect x="36" y="28" width="6" height="24"/>
            <rect x="48" y="28" width="6" height="24"/>
            <polygon points="32,4 60,24 4,24"/>
            <circle cx="32" cy="16" r="3" fill="#10b981"/>
          </svg>
          <div class="floating-coins">
            <span class="coin c1">$</span>
            <span class="coin c2">$</span>
            <span class="coin c3">$</span>
          </div>
        </div>

        <!-- UPI -->
        <div *ngSwitchCase="'upi'" class="upi-visual fade-in">
          <div class="qr-frame">
            <div class="qr-corner tl"></div><div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div><div class="qr-corner br"></div>
            <div class="qr-inner">
              <div class="qr-grid">
                <div *ngFor="let i of qrPixels" class="qp" [class.filled]="i === 1"></div>
              </div>
            </div>
          </div>
          <div class="scan-line"></div>
          <div class="upi-tag">UPI</div>
        </div>

        <!-- PAYTO -->
        <div *ngSwitchCase="'payto'" class="payto-visual fade-in">
          <div class="node-container">
            <div class="node user-node">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>You</span>
            </div>
            <div class="node-line">
              <div class="line-dot"></div>
              <div class="payto-label">PayTo</div>
            </div>
            <div class="node merchant-node">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M12 10v11M4 10l8-7 8 7"/></svg>
              <span>Merchant</span>
            </div>
          </div>
        </div>

        <!-- ZIP -->
        <div *ngSwitchCase="'zip'" class="brand-visual fade-in">
          <div class="brand-logo zip-bg">zip</div>
          <div class="brand-tag">0% Interest</div>
          <p class="brand-desc">Buy now, pay later</p>
        </div>

        <!-- AFTERPAY -->
        <div *ngSwitchCase="'afterpay'" class="brand-visual fade-in">
          <div class="brand-logo ap-bg">afterpay</div>
          <div class="timeline">
            <div class="time-step active"><div class="step-dot"></div><span>Today</span></div>
            <div class="time-line"></div>
            <div class="time-step"><div class="step-dot"></div><span>Wk 4</span></div>
            <div class="time-line"></div>
            <div class="time-step"><div class="step-dot"></div><span>Wk 8</span></div>
          </div>
          <p class="brand-desc">Pay over time, interest-free</p>
        </div>

        <!-- KLARNA -->
        <div *ngSwitchCase="'klarna'" class="klarna-card fade-in">
          <div class="kl-logo">Klarna<span>.</span></div>
          <div class="kl-options">
            <div class="kl-opt active">Pay now</div>
            <div class="kl-opt">Pay in 4</div>
          </div>
          <div class="kl-footer">Smoooth payments</div>
        </div>

        <!-- DEFAULT (Fallback) -->
        <div *ngSwitchDefault class="default-visual fade-in">
          <svg viewBox="0 0 64 64" fill="none" stroke="#10b981" stroke-width="1.5" width="120" height="120">
            <rect x="8" y="14" width="48" height="36" rx="6"/>
            <path d="M8 26h48"/>
            <path d="M20 38h8M36 38h8"/>
          </svg>
          <div class="default-label">Secure Payment</div>
        </div>

      </div>

      <!-- Amount Display -->
      <div class="amount-display">
        <div class="amount-label">TOTAL AMOUNT</div>
        <div class="amount-value">
          $789.60
          <span class="currency">AUD</span>
        </div>
        <div class="trust-badges">
          <span class="trust-badge">
            <svg viewBox="0 0 16 16" fill="none" width="12"><path d="M8 1.333l5.333 2v5.334c0 3.083-2.5 5.916-5.333 7-2.833-1.084-5.333-3.917-5.333-7V3.333L8 1.333z" stroke="#10b981" stroke-width="1.5"/></svg>
            Bank-grade Security
          </span>
          <span class="trust-badge">
            <svg viewBox="0 0 16 16" fill="none" width="12"><rect x="2" y="7" width="12" height="8" rx="1.5" stroke="#10b981" stroke-width="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#10b981" stroke-width="1.5"/></svg>
            256-bit Encryption
          </span>
          <span class="trust-badge">
            <svg viewBox="0 0 16 16" fill="none" width="12"><path d="M8 2C5.8 2 4 3.8 4 6v1H3v8h10V7h-1V6c0-2.2-1.8-4-4-4zm0 1.5c1.4 0 2.5 1.1 2.5 2.5v1h-5V6c0-1.4 1.1-2.5 2.5-2.5z" fill="#10b981"/></svg>
            Biometric Ready
          </span>
          <span class="trust-badge">
            <svg viewBox="0 0 16 16" fill="none" width="12"><rect x="1" y="4" width="14" height="9" rx="2" stroke="#10b981" stroke-width="1.5"/><path d="M1 7h14" stroke="#10b981" stroke-width="1.5"/></svg>
            PCI DSS Compliant
          </span>
        </div>
      </div>

      <!-- Decorative ghost orb -->
      <div class="ghost-orb"></div>
    </div>
  `,
  styles: []
})
export class VisualDisplayComponent {
  @Input() selectedMethod = 'card';

  qrPixels = [
    1,0,1,1,0,1,1,0,1,0,
    0,1,0,0,1,0,0,1,0,1,
    1,0,1,0,0,1,0,0,1,0,
    1,1,0,1,0,0,1,0,1,1,
    0,0,1,0,1,0,0,1,0,0,
    1,0,0,1,0,1,1,0,1,0,
    0,1,1,0,1,0,0,1,0,1,
    1,0,0,1,0,1,0,0,1,0,
    0,1,0,0,1,0,1,0,0,1,
    1,0,1,1,0,1,0,1,1,0,
  ];

  getGlowColor() {
    const colors: Record<string, string> = {
      card: 'rgba(16,185,129,0.6)',
      apple: 'rgba(200,200,200,0.4)',
      google: 'rgba(66,133,244,0.5)',
      bank: 'rgba(16,185,129,0.5)',
      upi: 'rgba(99,102,241,0.5)',
      payto: 'rgba(16,185,129,0.5)',
      zip: 'rgba(170,143,255,0.4)',
      afterpay: 'rgba(178,252,228,0.4)',
      klarna: 'rgba(255,179,199,0.4)',
    };
    return colors[this.selectedMethod] ?? colors['card'];
  }
}
