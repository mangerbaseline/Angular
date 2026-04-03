import { Component, signal, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, CurrencyPipe],
  template: `
    <div class="sidebar-root">

      <!-- Step Indicator -->
      <div class="flex items-center justify-center gap-2 mb-8" style="display:flex; justify-content:center; align-items:center; gap: 12px; margin-bottom: 32px;">
        <div style="display:flex; align-items:center;">
          <div [style.background]="isStepActive(1) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'" [style.color]="isStepActive(1) ? '#10b981' : '#94a3b8'" style="display:flex; align-items:center; gap: 8px; padding: 8px 16px; border-radius: 9999px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
            <span class="step-text" style="font-size:14px; font-weight:500;">Card Details</span>
          </div>
          <div style="width:32px; height:2px; margin: 0 8px; background: rgba(255,255,255,0.1);"></div>
        </div>
        <div style="display:flex; align-items:center;">
          <div [style.background]="isStepActive(2) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'" [style.color]="isStepActive(2) ? '#10b981' : '#94a3b8'" style="display:flex; align-items:center; gap: 8px; padding: 8px 16px; border-radius: 9999px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="step-text" style="font-size:14px; font-weight:500;">Verification</span>
          </div>
          <div style="width:32px; height:2px; margin: 0 8px; background: rgba(255,255,255,0.1);"></div>
        </div>
        <div style="display:flex; align-items:center;">
          <div [style.background]="isStepActive(3) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'" [style.color]="isStepActive(3) ? '#10b981' : '#94a3b8'" style="display:flex; align-items:center; gap: 8px; padding: 8px 16px; border-radius: 9999px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
            <span class="step-text" style="font-size:14px; font-weight:500;">Complete</span>
          </div>
        </div>
      </div>

      <!-- Method tabs with grid -->
      <div class="method-tabs-section">
        <p class="section-title">Choose payment method</p>
        <div class="method-tabs">
          <button
            *ngFor="let m of methods"
            [class.selected]="selectedMethod() === m.id"
            (click)="selectMethod(m.id)"
            class="method-tab"
            [style.--m-color]="m.color">
            <span class="tab-icon" [innerHTML]="m.svg | safeHtml"></span>
            <div class="tab-text">
              <span class="tab-name">{{ m.name }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Dynamic Form Area -->
      <div class="form-area">
        <div [ngSwitch]="selectedMethod()" class="form-switch">

          <!-- CARD -->
          <div *ngSwitchCase="'card'" class="payment-form fade-in">
            <div class="input-group">
              <label>CARD NUMBER</label>
              <div class="icon-input has-icon">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
                <input type="text" placeholder="1234 5678 9012 3456" (input)="onCardNumberInput($event)">
                <div class="net-icons">
                  <div class="mc" [class.active-net]="detectedCardType() === 'mastercard'"><div class="mc-r"></div><div class="mc-o"></div></div>
                  <svg viewBox="0 0 38 14" width="24" [class.active-net]="detectedCardType() === 'visa'"><text y="12" font-size="11" fill="#1434CB" font-weight="800">VISA</text></svg>
                </div>
              </div>
            </div>
            <div class="input-group">
              <label>CARDHOLDER NAME</label>
              <div class="icon-input">
                <input type="text" placeholder="John Doe">
              </div>
            </div>
            <div class="row-2col">
              <div class="input-group">
                <label>EXPIRY DATE</label>
                <div class="icon-input">
                  <input type="text" placeholder="MM/YY">
                </div>
              </div>
              <div class="input-group">
                <label>SECURITY CODE</label>
                <div class="icon-input">
                  <input type="password" placeholder="•••">
                  <button class="eye-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <label class="save-check">
              <input type="checkbox">
              <span>Save card for future payments</span>
            </label>
          </div>

          <!-- APPLE PAY -->
          <div *ngSwitchCase="'apple'" class="wallet-form fade-in">
            <div class="wallet-card">
              <div class="wallet-icon-wrap apple-w">
                <svg viewBox="0 0 24 24" fill="white" width="36">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
                  <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h3>Apple Pay</h3>
              <p>Use Face ID or Touch ID to complete payment</p>
            </div>
          </div>

          <!-- GOOGLE PAY -->
          <div *ngSwitchCase="'google'" class="wallet-form fade-in">
            <div class="wallet-card">
              <div class="wallet-icon-wrap google-w">
                <div class="g-dots-row">
                  <div class="gd" style="background:#4285F4"></div>
                  <div class="gd" style="background:#EA4335"></div>
                  <div class="gd" style="background:#FBBC05"></div>
                  <div class="gd" style="background:#34A853"></div>
                </div>
              </div>
              <h3>Google Pay</h3>
              <p>Use your saved cards to complete payment</p>
            </div>
          </div>

          <!-- BANK -->
          <div *ngSwitchCase="'bank'" class="payment-form fade-in">
            <div class="input-group">
              <label>ACCOUNT NUMBER</label>
              <div class="icon-input has-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M12 10v11M4 10l8-7 8 7"/></svg>
                <input type="text" placeholder="Enter your account number">
              </div>
            </div>
            <div class="input-group">
              <label>BSB NUMBER</label>
              <div class="icon-input">
                <input type="text" placeholder="000-000">
              </div>
            </div>
            <div class="input-group">
              <label>ACCOUNT HOLDER NAME</label>
              <div class="icon-input">
                <input type="text" placeholder="John Doe">
              </div>
            </div>
          </div>

          <!-- UPI -->
          <div *ngSwitchCase="'upi'" class="payment-form fade-in">
            <div class="input-group" style="margin-bottom: 24px;">
              <label>UPI ID</label>
              <div class="icon-input has-icon">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                <input type="text" placeholder="yourname@upi">
              </div>
            </div>

            <!-- Lovable HTML Implementation -->
            <div class="glass" style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="width: 160px; height: 160px; margin: 0 auto 16px; background: white; border-radius: 12px; padding: 12px;">
                <div style="width: 100%; height: 100%; border-radius: 8px; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); gap: 2px; padding: 4px;">
                  <div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div>
                </div>
              </div>
              <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">Scan with any UPI app to pay instantly</p>
            </div>
          </div>

          <!-- PayTo -->
          <div *ngSwitchCase="'payto'" class="payment-form fade-in">
            <div class="input-group">
              <label>BSB NUMBER</label>
              <div class="icon-input has-icon">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M12 10v11M4 10l8-7 8 7"/></svg>
                <input type="text" placeholder="000-000">
              </div>
            </div>
            <div class="input-group">
              <label>ACCOUNT NUMBER</label>
              <div class="icon-input">
                <input type="text" placeholder="Enter your account number">
              </div>
            </div>
            <div class="input-group">
              <label>ACCOUNT NAME</label>
              <div class="icon-input">
                <input type="text" placeholder="John Doe">
              </div>
            </div>
            
            <div class="glass p-4 rounded-xl mb-6" style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px; margin-bottom: 24px; display:flex; align-items:center; gap: 12px;">
              <div class="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center" style="width:32px; height:32px; background:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                <svg viewBox="0 0 20 20" fill="none" width="16" stroke="white" stroke-width="2"><path d="M14 10h-8M10 4l6 6-6 6"/></svg>
              </div>
              <div>
                <h4 style="margin:0; font-size:14px; font-weight:700; color:white;">Real-time authorization</h4>
                <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.6);">Direct debit with instant confirmation</p>
              </div>
            </div>
          </div>

          <!-- ZIP -->
          <div *ngSwitchCase="'zip'" class="wallet-form fade-in">
            <h2 class="brand-title zip-c">zip</h2>
            <h3 class="form-title">Buy now, pay later</h3>
            <p class="form-text">Split your purchase into easy instalments. You'll be redirected to Zip to complete.</p>
            <div class="status-badge">
              <span class="dot"></span> No impact on your credit score
            </div>
          </div>

          <!-- AFTERPAY -->
          <div *ngSwitchCase="'afterpay'" class="wallet-form fade-in">
            <h2 class="brand-title ap-c">afterpay</h2>
            <h3 class="form-title">Buy now, pay later</h3>
            <p class="form-text">Shop now and pay over time. You'll be redirected to Afterpay to set up your plan.</p>
            <div class="status-badge">
              <span class="dot"></span> No impact on your credit score
            </div>
          </div>

          <!-- KLARNA -->
          <div *ngSwitchCase="'klarna'" class="wallet-form fade-in">
            <h2 class="brand-title kl-c">Klarna<span>.</span></h2>
            <h3 class="form-title">Flexible payment options</h3>
            <p class="form-text">Choose how you want to pay — now, later, or in slices. You'll be redirected to Klarna.</p>
            <div class="status-badge">
              <span class="dot"></span> No impact on your credit score
            </div>
          </div>

          <!-- LINK -->
          <div *ngSwitchCase="'link'" class="fade-in" style="width: 100%;">
            <div class="glass rounded-2xl p-6 mb-5" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
              <div class="flex items-center gap-3 mb-4" style="display:flex; align-items:center; gap: 12px; margin-bottom: 16px;">
                <div class="w-10 h-10 rounded-lg bg-[#00D66F] flex items-center justify-center" style="width: 40px; height: 40px; border-radius: 8px; background: #00D66F; display:flex; align-items:center; justify-content:center;">
                  <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="width: 20px; color: white;"><path d="M7 8h10M7 12h7M7 16h4"></path></svg>
                </div>
                <div>
                  <h3 class="font-display font-semibold text-foreground" style="font-weight: 600; font-size: 16px; color: white; margin: 0;">Link</h3>
                  <p class="text-xs text-muted-foreground" style="font-size: 12px; color: var(--text-secondary); margin: 0;">Fast, secure 1-click checkout</p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground mb-4" style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.4;">Save your payment info once and check out with a single click across thousands of merchants. Powered by Stripe.</p>
              <div class="space-y-3">
                <div class="relative">
                  <label class="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider" style="display:block; font-size:11px; margin-bottom: 8px; color: var(--text-secondary); text-transform: uppercase;">Email</label>
                  <div class="relative group">
                    <div class="relative flex items-center">
                      <input type="text" placeholder="you@example.com" style="width: 100%; padding: 14px 16px; background: rgba(30,41,59,0.5); border: 1px solid var(--glass-border); border-radius: 12px; color: white; outline: none; box-sizing: border-box; font-family: inherit;">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="relative w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30" tabindex="0" style="width: 100%; padding: 16px 24px; border-radius: 12px; border: none; background: linear-gradient(to right, #10b981, #34d399); color: white; font-weight: 600; display:flex; gap: 12px; justify-content:center; align-items:center; cursor: pointer; font-size: 16px; font-family: inherit; font-size: 16px;">
              <span class="relative flex items-center gap-2">Continue with Link
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </span>
            </button>
            <p class="text-center text-xs text-muted-foreground" style="text-align: center; font-size: 12px; margin-top: 16px; color: var(--text-secondary);">⚡ 1-click checkout • Saved securely • Powered by Stripe</p>
          </div>

          <!-- DEFAULT -->
          <div *ngSwitchDefault class="wallet-form fade-in">
            <div class="wallet-card">
              <div class="wallet-icon-wrap default-w">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" width="36"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
              </div>
              <h3>{{ getMethodName() }}</h3>
              <p>Click below to complete your payment</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Pay CTA -->
      <div class="cta-section" *ngIf="selectedMethod() !== 'link'">
        <button class="pay-btn" (click)="pay()" [class.loading]="isProcessing()">
          <ng-container *ngIf="!isProcessing()">
            {{ getCTA() }}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="18"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
          </ng-container>
          <div class="spinner" *ngIf="isProcessing()"></div>
        </button>
        <p class="cta-note" style="margin-top:16px;">0% interest • No hidden fees • Approval in seconds</p>
        <p class="tos-text" style="color:rgba(255,255,255,0.4); font-size:11px; margin-top:12px;">By continuing, you agree to our <a href="#" style="color:#10b981; text-decoration:none;">Terms of Service</a> and <a href="#" style="color:#10b981; text-decoration:none;">Privacy Policy</a></p>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <button class="summary-header" (click)="toggleSummary()">
          <div class="sh-left">
            <div class="bag-icon-wrap">
              <svg viewBox="0 0 20 20" fill="none" width="16"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#10b981" stroke-width="1.5"/><path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#10b981" stroke-width="1.5"/></svg>
            </div>
            <div>
              <div class="sh-title">Order Summary</div>
              <div class="sh-items">{{ items.length }} items</div>
            </div>
          </div>
          <div class="sh-right">
            <span class="sh-total">$789.60</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" class="chev" [class.open]="showSummary()"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </button>

        <div class="summary-body" *ngIf="showSummary()">
          <div class="item-row" *ngFor="let item of items">
            <div class="item-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" width="18" stroke="currentColor" stroke-width="2">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div class="item-body">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-desc">{{ item.desc }}</div>
              <div class="item-qty">Qty: {{ item.qty }}</div>
            </div>
            <div class="item-price">{{ item.price | currency }}</div>
          </div>

          <div class="breakdown">
            <div class="br-row"><span>Subtotal</span><span>$786.00</span></div>
            <div class="br-row">
              <span class="with-icon">
                <svg viewBox="0 0 24 24" fill="none" width="13" stroke="currentColor" stroke-width="2"><path d="M10 17h4V5H2v12h3m15-4h-9v4m9-4v4m-12 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 9l3 2v4h-3V9z"/></svg>
                Shipping
              </span>
              <span class="green">FREE</span>
            </div>
            <div class="br-row"><span>Tax (GST)</span><span>$78.60</span></div>
            <div class="br-row discount-row">
              <span class="with-icon green">
                <svg viewBox="0 0 24 24" fill="none" width="13" stroke="currentColor" stroke-width="2"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L14.7 21a2.4 2.4 0 0 1-3.4 0L5 14.7V5z"/><path d="M9 9h.01"/></svg>
                Discount Applied
              </span>
              <span class="red">-$75.00</span>
            </div>
          </div>

          <!-- Promo code -->
          <div class="promo-row">
            <input type="text" class="promo-input" placeholder="Promo code">
            <button class="apply-btn">Apply</button>
          </div>

          <!-- Total -->
          <div class="total-row">
            <div>
              <div class="total-label">Total</div>
              <div class="gst-note">Including GST</div>
            </div>
            <div class="total-price">$789.60</div>
          </div>

          <!-- Trust badges -->
          <div class="trust-row">
            <span class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" width="12" height="12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Secure checkout
            </span>
            <span class="trust-sep">·</span>
            <span class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" width="12" height="12"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              Fast delivery
            </span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .sidebar-root {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Steps sizing */
    .step-text {
      font-size: 14px;
      font-weight: 500;
      display: none;
    }
    @media (min-width: 640px) {
      .step-text {
        display: inline;
      }
    }
    .steps-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px; /* mb-8 */
    }
    .step-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px; /* px-4 py-2 */
      border-radius: 9999px;
      font-size: 14px; /* text-sm */
      font-weight: 500;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
    }
    .step-pill.active {
      background: rgba(16, 185, 129, 0.2); /* bg-primary/20 */
      border-color: transparent;
      color: var(--brand-green);
    }
    .step-line {
      width: 32px; /* w-8 */
      height: 2px; /* h-0.5 */
      margin: 0 8px; /* mx-2 */
      background: var(--text-secondary);
      opacity: 0.3;
    }

    @media (max-width: 1300px) and (min-width: 860px) {
      .method-tabs { gap: 4px; }
      .tab-name { font-size: 8.5px; }
      .tab-icon { width: 16px; height: 16px; min-width: 16px; }
      .method-tab { padding: 8px 4px; }
    }

    @media (max-width: 860px) {
      .sidebar-root {
        padding: 12px 10px 10px;
      }
    }

    .method-tabs-section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 14px;
    }
    .method-tabs {
       display: grid;
       grid-template-columns: repeat(5, minmax(0, 1fr)); /* Force equal widths */
       gap: 6px;
       width: 100%;
       box-sizing: border-box;
    }

    .method-tab {
      width: 100%; /* Fill the grid cell */
      min-width: 0; /* Allow shrinking below content width */
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 6px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(15, 23, 42, 0.4);
      color: #94a3b8;
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      position: relative;
      overflow: visible; /* Fixed clipping */
    }
    .method-tab:hover {
      background: color-mix(in srgb, var(--m-color) 12%, rgba(15, 23, 42, 0.4));
      border-color: color-mix(in srgb, var(--m-color) 50%, transparent);
      color: var(--m-color);
      transform: none;
    }
    .method-tab.selected {
      background: color-mix(in srgb, var(--m-color) 15%, rgba(15, 23, 42, 0.4));
      border-color: color-mix(in srgb, var(--m-color) 60%, transparent);
      box-shadow: 0 0 16px -2px color-mix(in srgb, var(--m-color) 30%, transparent);
      color: var(--m-color);
      transform: none;
    }
    .tab-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-bottom: 2px;
      transition: transform 2.5s cubic-bezier(0.19, 1, 0.22, 1);
      will-change: transform;
    }
    .method-tab:active .tab-icon {
      transform: rotate(-70deg) scale(1.8);
    }
    .method-tab:active {
      transform: none;
    }
    .tab-name {
      font-size: 10px;
      font-weight: 600;
      text-align: center;
      width: 100%;
    }

    .net-icons {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mc, .net-icons svg {
      opacity: 0.2;
      transition: opacity 0.3s ease;
    }
    .active-net {
      opacity: 1 !important;
    }

    /* Input Styling */
    .input-group label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 10px;
    }
    .icon-input input {
      width: 100%;
      padding: 16px 18px !important;
      border-radius: 12px !important;
      background: rgba(15, 23, 42, 0.5) !important;
      border: 1px solid var(--glass-border) !important;
      color: var(--text-primary) !important;
      font-size: 15px !important;
    }
    .icon-input.has-icon input { padding-left: 48px !important; }

    /* Footer / Total */
    .pay-btn {
      width: 100% !important;
      padding: 14px !important;
      border-radius: 12px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      margin-top: 10px;
    }
    .order-summary {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      overflow: hidden;
    }
    .summary-header {
      padding: 14px !important;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    /* Hide subtabs for clean grid */
    .tab-sub { display: none; }
    @media (max-width: 860px) {
      .sidebar-root {
        padding: 12px 10px 10px; /* Reduced top padding from 40px to 12px */
      }
    }

    /* UPI QR Scan Area Styling (Red Box Design) */
    .upi-qr-scan-area {
      background: rgba(15, 23, 42, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 10px;
      transition: all 0.5s ease;
    }

    .qr-main-box {
      width: 140px;
      height: 140px;
      background: #ffffff;
      border-radius: 18px;
      position: relative;
      padding: 12px;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
    }

    .qr-grid-overlay {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1px;
      border: 2px solid #000000;
      border-radius: 8px;
      background: #000000;
      overflow: hidden;
    }

    .grid-row {
      flex: 1;
      display: flex;
      gap: 1px;
    }

    .grid-row span {
      flex: 1;
      background: #ffffff;
    }

    .qr-helper-text {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      margin: 0;
    }
  `]
})
export class PaymentCardComponent {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;
  @ViewChild('scrollTrack') scrollTrack!: ElementRef;
  @Output() methodChange = new EventEmitter<string>();
  @Output() cardTypeChange = new EventEmitter<string>();

  selectedMethod = signal('card');
  detectedCardType = signal('visa');
  isProcessing = signal(false);
  showSummary = signal(true);

  onCardNumberInput(event: any) {
    const val = event.target.value.replace(/\s+/g, '');
    let type = 'visa'; // Default as requested
    if (val.startsWith('5')) type = 'mastercard';
    else if (val.startsWith('3')) type = 'amex';

    this.detectedCardType.set(type);
    this.cardTypeChange.emit(type);
  }

  // Drag-scroll state (container)
  private isDragging = false;
  private dragStartX = 0;
  private scrollStartX = 0;

  // Thumb drag state
  private isThumbDragging = false;
  private thumbDragStartX = 0;
  private thumbDragStartLeft = 0;

  thumbWidth = 60;
  thumbLeft = 0;

  constructor() {
    // Global listeners for thumb dragging
    window.addEventListener('mousemove', (e) => this.onThumbMove(e));
    window.addEventListener('mouseup', () => this.onThumbEndDrag());
  }

  isStepActive(step: number): boolean {
    const method = this.selectedMethod();
    const isSpecialMethod = ['card', 'bank', 'payto'].includes(method);

    if (step === 1) return !isSpecialMethod;
    if (step === 2) return isSpecialMethod;
    return false;
  }

  onTabsDragStart(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    this.isDragging = true;
    this.dragStartX = e.pageX - el.offsetLeft;
    this.scrollStartX = el.scrollLeft;
    el.classList.add('dragging');
  }

  onTabsDragMove(e: MouseEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.dragStartX) * 1.5;
    el.scrollLeft = this.scrollStartX - walk;
    this.updateThumb(el);
  }

  onThumbStartDrag(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isThumbDragging = true;
    this.thumbDragStartX = e.pageX;
    this.thumbDragStartLeft = this.thumbLeft;
  }

  private onThumbMove(e: MouseEvent) {
    if (!this.isThumbDragging || !this.tabsContainer || !this.scrollTrack) return;

    const deltaX = e.pageX - this.thumbDragStartX;
    const trackWidth = this.scrollTrack.nativeElement.clientWidth;
    const maxThumbLeft = trackWidth - this.thumbWidth;

    let newThumbLeft = this.thumbDragStartLeft + deltaX;
    newThumbLeft = Math.max(0, Math.min(newThumbLeft, maxThumbLeft));

    this.thumbLeft = newThumbLeft;

    // Sync container scroll
    const container = this.tabsContainer.nativeElement;
    const scrollRatio = newThumbLeft / maxThumbLeft;
    container.scrollLeft = scrollRatio * (container.scrollWidth - container.clientWidth);
  }

  private onThumbEndDrag() {
    this.isThumbDragging = false;
  }

  onTabsDragEnd() {
    this.isDragging = false;
  }

  onTabsScroll(e: Event) {
    const el = e.target as HTMLElement;
    this.updateThumb(el);
  }

  moveTabs(dir: 'left' | 'right') {
    if (!this.tabsContainer) return;
    const el = this.tabsContainer.nativeElement as HTMLElement;
    const amount = dir === 'left' ? -200 : 200;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  private updateThumb(el: HTMLElement) {
    const ratio = el.clientWidth / el.scrollWidth;
    const trackWidth = el.clientWidth;
    this.thumbWidth = Math.max(30, trackWidth * ratio);
    this.thumbLeft = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (trackWidth - this.thumbWidth);
  }

  methods = [
    {
      id: 'card', name: 'Card', color: '#3b82f6',
      svg: '<div style="display:flex; align-items:center; gap: 2px;"><svg style="width:16px; height:12px;" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#1A1F71"></rect><path d="M19.5 21h-3.2l2-12.4h3.2L19.5 21zm13.3-12.1c-.6-.3-1.6-.5-2.9-.5-3.2 0-5.4 1.7-5.4 4.1 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.7c.7.3 2.1.6 3.5.6 3.4 0 5.6-1.7 5.6-4.2 0-1.4-.8-2.5-2.7-3.4-1.1-.6-1.8-.9-1.8-1.5 0-.5.6-1 1.8-1 1 0 1.8.2 2.4.5l.3.1.4-2.7z" fill="#fff"></path><path d="M37.3 8.6h-2.5c-.8 0-1.3.2-1.7 1L28.8 21h3.4l.7-1.9h4.1l.4 1.9H40L37.3 8.6zm-3.5 8.1l1.7-4.7.5 2.3.5 2.4h-2.7z" fill="#fff"></path><path d="M15.6 8.6L12.4 17l-.3-1.7c-.6-2-2.4-4.2-4.4-5.3l2.9 11h3.4l5.1-12.4h-3.5z" fill="#fff"></path><path d="M9.8 8.6H4.6l-.1.3c4 1 6.7 3.5 7.8 6.5l-1.1-5.7c-.2-.8-.8-1-1.4-1.1z" fill="#F7B600"></path></svg><svg style="width:16px; height:12px;" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#252525"></rect><circle cx="19" cy="16" r="8" fill="#EB001B"></circle><circle cx="29" cy="16" r="8" fill="#F79E1B"></circle><path d="M24 10.3a8 8 0 010 11.4 8 8 0 010-11.4z" fill="#FF5F00"></path></svg><svg style="width:16px; height:12px;" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#2E77BC"></rect><path d="M6 16l3-8h4l3 8-3 8H9L6 16zm12-8h10l2 3 2-3h10l-6 8 6 8H32l-2-3-2 3H18l6-8-6-8z" fill="#fff" opacity="0.9"></path></svg></div>'
    },
    {
      id: 'apple', name: 'Apple Pay', color: '#e2e8f0', // Smoke gray
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path></svg>'
    },
    {
      id: 'google', name: 'Google Pay', color: '#0ea5e9', // Sky blue from user's HTML snippet
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>'
    },
    {
      id: 'bank', name: 'Bank', color: '#10b981',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"></path></svg>'
    },
    {
      id: 'upi', name: 'UPI', color: '#f97316',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24"><path d="M11 4L7 20" stroke="#097939" stroke-width="2.5" stroke-linecap="round"></path><path d="M13 4L17 20" stroke="#ED752E" stroke-width="2.5" stroke-linecap="round"></path><path d="M7 4L11 20" stroke="#097939" stroke-width="2.5" stroke-linecap="round"></path></svg>'
    },
    {
      id: 'payto', name: 'PayTo', color: '#22d3ee',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" stroke-width="1.5"></rect><path d="M7 12h6M13 12l-2-2M13 12l-2 2" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="17" cy="12" r="1.5" fill="#22d3ee"></circle></svg>'
    },
    {
      id: 'zip', name: 'Zip', color: '#a78bfa',
      svg: '<span style="font-weight:800; font-size:14px; letter-spacing:-0.02em; background: linear-gradient(to right, #a78bfa, #e879f9); -webkit-background-clip: text; color: transparent;">zip</span>'
    },
    {
      id: 'afterpay', name: 'Afterpay', color: '#2dd4bf',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="url(#apGrad)"></circle><defs><linearGradient id="apGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#b2fce4"></stop><stop offset="100%" stop-color="#2dd4bf"></stop></linearGradient></defs><path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="#0d3d2e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    },
    {
      id: 'klarna', name: 'Klarna', color: '#f472b6',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#FFB3C7"></rect><path d="M7 6c0 2.5-1 4.5-3 6 2 1.5 3 3.5 3 6" stroke="#0A0B09" stroke-width="2" fill="none" stroke-linecap="round"></path><line x1="13" y1="6" x2="13" y2="18" stroke="#0A0B09" stroke-width="2" stroke-linecap="round"></line><circle cx="18" cy="16" r="2" fill="#0A0B09"></circle></svg>'
    },
    {
      id: 'link', name: 'Link', color: '#22c55e',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#00D66F"></rect><path d="M7 8h10M7 12h7M7 16h4" stroke="white" stroke-width="2" stroke-linecap="round"></path></svg>'
    }

  ];

  items = [
    { name: 'Premium Wireless Headpho...', desc: 'Noise cancelling, 40hr battery', qty: 1, price: 599.00 },
    { name: 'Leather Carrying Case', desc: 'Genuine leather, fits all sizes', qty: 1, price: 89.00 },
    { name: 'USB-C Fast Charger', desc: '65W GaN Technology', qty: 2, price: 98.00 },
  ];

  selectMethod(id: string) {
    this.selectedMethod.set(id);
    this.methodChange.emit(id);
  }

  getMethodName() {
    return this.methods.find(m => m.id === this.selectedMethod())?.name ?? 'Pay';
  }

  getCTA() {
    const method = this.selectedMethod();
    if (method === 'payto') return 'Authorize $789.60';
    if (method === 'zip') return 'Continue with Zip';
    if (method === 'afterpay') return 'Continue with Afterpay';
    if (method === 'klarna') return 'Pay first instalment';
    if (method === 'upi') return 'Verify & Pay $789.60';
    return 'Pay $789.60';
  }

  toggleSummary() {
    this.showSummary.set(!this.showSummary());
  }

  @Output() paymentSuccess = new EventEmitter<void>();

  pay() {
    this.isProcessing.set(true);
    setTimeout(() => {
      this.isProcessing.set(false);
      this.paymentSuccess.emit();
    }, 2000);
  }
}
