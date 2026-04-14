import { Component, signal, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

declare var Stripe: any;
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, CurrencyPipe],
  template: `
    <div class="sidebar-root">
      <div *ngIf="toastMessage()" class="toast-overlay fade-in">
        <div class="toast-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>{{ toastMessage() }}</span>
        </div>
      </div>
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
      <div class="form-area">
        <div [ngSwitch]="selectedMethod()" class="form-switch">
          <div *ngSwitchCase="'card'" class="wallet-form fade-in">
            <div class="wallet-card">
              <div class="wallet-icon-wrap default-w">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" width="40"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
              </div>
              <h3>Credit or Debit Card</h3>
              <p>Enter your card details safely and securely below</p>
            </div>
          </div>
          <div *ngSwitchCase="'apple'" class="wallet-form fade-in">
            <div class="wallet-card">
              <div class="wallet-icon-wrap apple-w ">
                <svg viewBox="0 0 24 24" fill="white" width="36">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
                  <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h3>Apple Pay</h3>
              <p>Use Face ID or Touch ID to complete payment</p>
            </div>
          </div>
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
          <div *ngSwitchCase="'bank'" class="payment-form fade-in">
            <div class="input-group">
              <label>ACCOUNT NUMBER</label>
              <div class="icon-input has-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 w-5 h-5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>                <input type="text" placeholder="Enter your account number">
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
          <div *ngSwitchCase="'upi'" class="payment-form fade-in">
            <div class="input-group" style="margin-bottom: 24px;">
              <label>UPI ID</label>
              <div class="icon-input has-icon">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                <input type="text" placeholder="yourname@upi">
              </div>
            </div>
            <div class="glass" style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; text-align: center;">
              <div style="width: 160px; height: 160px; margin: 0 auto 16px; background: white; border-radius: 12px; padding: 12px;">
                <div style="width: 100%; height: 100%; border-radius: 8px; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); gap: 2px; padding: 4px;">
                  <div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div><div style="border-radius: 1px; background: #111827;"></div>
                </div>
              </div>
              <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">Scan with any UPI app to pay instantly</p>
            </div>
          </div>
          <div *ngSwitchCase="'payto'" class="payment-form fade-in">
            <div class="input-group">
              <label>FULL NAME</label>
              <div class="icon-input has-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="John Doe" (input)="paytoName.set($any($event.target).value)">
              </div>
            </div>
            <div class="input-group">
              <label>EMAIL ADDRESS</label>
              <div class="icon-input has-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" placeholder="john@example.com" (input)="paytoEmail.set($any($event.target).value)">
              </div>
            </div>
            <div class="input-group">
              <label>PAYID (EMAIL OR PHONE)</label>
              <div class="icon-input has-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <input type="text" placeholder="your@payid.com" (input)="paytoID.set($any($event.target).value)">
              </div>
            </div>
            <div class="glass p-4 rounded-xl mb-6" style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px; margin-bottom: 24px; display:flex; align-items:center; gap: 12px;">
              <div class="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center" style="width:32px; height:32px; background:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                <svg viewBox="0 0 20 20" fill="none" width="16" stroke="white" stroke-width="2"><path d="M14 10h-8M10 4l6 6-6 6"/></svg>
              </div>
              <div>
                <h4 style="margin:0; font-size:14px; font-weight:700; color:white;">Real-time authorization</h4>
                <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.6);">Direct debit with instant confirmation via PayID</p>
              </div>
            </div>
          </div>
          <div *ngSwitchCase="'zip'" class="wallet-form fade-in">
            <h2 class="brand-title zip-c">zip</h2>
            <h3 class="form-title">Buy now, pay later</h3>
            <p class="form-text">Split your purchase into easy instalments. You'll be redirected to Zip to complete.</p>
            <div class="status-badge">
              <span class="dot"></span> No impact on your credit score
            </div>
          </div>
          <div *ngSwitchCase="'afterpay'" class="wallet-form fade-in">
            <h2 class="brand-title ap-c">afterpay</h2>
            <h3 class="form-title">Buy now, pay later</h3>
            <p class="form-text">Shop now and pay over time. You'll be redirected to Afterpay to set up your plan.</p>
            <div class="status-badge">
              <span class="dot"></span> No impact on your credit score
            </div>
          </div>
          <div *ngSwitchCase="'klarna'" class="wallet-form fade-in">
            <h2 class="brand-title kl-c">Klarna<span>.</span></h2>
            <h3 class="form-title">Flexible payment options</h3>
            <p class="form-text">Choose how you want to pay — now, later, or in slices. You'll be redirected to Klarna.</p>
            <div class="status-badge">
              <span class="dot"></span> No impact on your credit score
            </div>
          </div>
          <div *ngSwitchCase="'link'" class="wallet-form fade-in">
            <div class="wallet-card">
              <div class="wallet-icon-wrap link-w" style="background: #00D66F; padding: 10px; border-radius: 12px; display:flex; align-items:center; justify-content:center;">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="36" stroke-linecap="round"><path d="M7 8h10M7 12h7M7 16h4"></path></svg>
              </div>
              <h3>Link</h3>
              <p>Fast, secure 1-click checkout powered by Stripe</p>
            </div>
          </div>
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
        <div id="stripe-payment-element-mount-point" [style.display]="isStripeMethod() ? 'block' : 'none'" style="margin-top: 24px; min-height: 150px; background: rgba(30, 41, 59, 0.3); padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); position: relative;">
          <div *ngIf="isStripeLoading()" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; z-index: 10;">
            <div class="spinner"></div>
            <span style="font-size: 13px; color: rgba(255,255,255,0.6);">Setting up secure payment...</span>
          </div>
        </div>
      </div>
      <div class="cta-section">
        <button class="pay-btn" (click)="pay()" [class.loading]="isProcessing()">
          <ng-container *ngIf="!isProcessing()">
            {{ getCTA() }}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="18"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
          </ng-container>
          <div class="spinner" *ngIf="isProcessing()"></div>
        </button>
        <p class="cta-note" style="margin-top:16px;">0% interest • No hidden fees • Approval in seconds</p>
      </div>

      <div class="order-summary" [class.invoice-mode]="isInvoice()">
        <button class="summary-header" (click)="toggleSummary()">
          <div class="sh-left">
            <div class="bag-icon-wrap" [class.invoice-icon]="isInvoice()">
                <svg *ngIf="!isInvoice()" viewBox="0 0 24 24" fill="none" width="18" stroke="currentColor" stroke-width="2">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                <svg *ngIf="isInvoice()" viewBox="0 0 24 24" fill="none" width="18" stroke="currentColor" stroke-width="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
            </div>
            <div>
              <div class="sh-title">{{ isInvoice() ? 'Invoice Details' : 'Order Summary' }}</div>
              <div class="sh-items">{{ isInvoice() ? invoiceNo() : items().length + ' items' }}</div>
            </div>
          </div>
          <div class="sh-right">
            <span class="sh-total">{{ totalAmount() | currency }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" class="chev" [class.open]="showSummary()"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </button>

        <div class="summary-body" *ngIf="showSummary()">
          <div *ngIf="loadingOrder()" class="p-6">
            <div class="skeleton-line mb-3" style="height: 50px; border-radius: 8px;"></div>
            <div class="skeleton-line" style="height: 50px; border-radius: 8px;"></div>
          </div>
          <ng-container *ngIf="!isInvoice() && !loadingOrder()">
            <div class="item-row" *ngFor="let item of items()">
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
              <div class="br-row"><span>Subtotal</span><span>{{ subtotal() | currency }}</span></div>
              <div class="br-row" *ngIf="fees() > 0">
                 <span>Platform Fees</span>
                 <span>{{ fees() | currency }}</span>
              </div>
              <div class="br-row discount-row" *ngIf="discount() > 0">
                <span class="with-icon green">
                  <svg viewBox="0 0 24 24" fill="none" width="13" stroke="currentColor" stroke-width="2"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L14.7 21a2.4 2.4 0 0 1-3.4 0L5 14.7V5z"/><path d="M9 9h.01"/></svg>
                  Discount Applied
                </span>
                <span class="green">-{{ discount() | currency }}</span>
              </div>
            </div>
          </ng-container>
          <ng-container *ngIf="isInvoice() && !loadingOrder()">
            <div class="invoice-content">
              <h2 class="invoice-main-title">INVOICE</h2>
              
              <div class="invoice-meta-grid">
                <div class="meta-item">
                  <span class="meta-label">To</span>
                  <span class="meta-value">{{ customerName() }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Invoice No.</span>
                  <span class="meta-value">{{ invoiceNo() }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Issued On</span>
                  <span class="meta-value">{{ issueDate() | date:'dd-MM-yyyy' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">From</span>
                  <div class="meta-value multi">
                    <div>{{ merchantPhone() }}</div>
                    <div>{{ merchantEmail() }}</div>
                  </div>
                </div>
              </div>

              <div class="invoice-table-container">
                <table class="invoice-table">
                  <thead>
                    <tr>
                      <th class="text-left">Item</th>
                      <th class="text-center">Qty.</th>
                      <th class="text-right">Rate</th>
                      <th class="text-right">Amount AU</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of items()">
                      <td class="text-left item-name-td">{{ item.name }}</td>
                      <td class="text-center">{{ item.qty | number:'2.0-0' }}</td>
                      <td class="text-right">{{ item.price | number:'1.2-2' }}</td>
                      <td class="text-right">{{ (item.price * item.qty) | number:'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="invoice-calc-footer">
                <div class="calc-row">
                  <span class="calc-label">Subtotal</span>
                  <span class="calc-value">{{ subtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="calc-row">
                  <span class="calc-label">Shipping</span>
                  <span class="calc-value green">FREE</span>
                </div>
                <div class="calc-row discount" *ngIf="discount() > 0">
                  <span class="calc-label pink-text">Discount</span>
                  <span class="calc-value pink-text">{{ discount() | number:'1.2-2' }}</span>
                </div>
                <div class="calc-row">
                  <span class="calc-label">Total Tax (GST)</span>
                  <span class="calc-value">{{ tax() | number:'1.2-2' }}</span>
                </div>
                <div class="calc-total-row">
                  <span class="total-text">Total Amount</span>
                  <span class="total-val">{{ totalAmount() | currency:'USD' }}</span>
                </div>
              </div>
            </div>
          </ng-container>
          <!-- <div class="promo-row" *ngIf="!isInvoice()">
            <input type="text" class="promo-input" placeholder="Promo code">
            <button class="apply-btn">Apply</button>
          </div> -->

          <div class="total-row" *ngIf="!isInvoice()">
            <div>
              <div class="total-label">Total</div>
              <div class="gst-note">Including GST</div>
            </div>
            <div class="total-price">{{ totalAmount() | currency }}</div>
          </div>
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
    .sidebar-root { width: 100%; display: flex; flex-direction: column; gap: 24px; position: relative; }
    .toast-overlay {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      pointer-events: none;
    }
    .toast-card {
      background: rgba(16, 185, 129, 0.9);
      backdrop-filter: blur(8px);
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
      font-size: 14px;
    }

    .fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .step-text { font-size: 14px; font-weight: 500; display: none; }
    @media (min-width: 640px) { .step-text { display: inline; } }
    .steps-bar { display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
    .step-pill { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-secondary); }
    .step-pill.active { background: rgba(16, 185, 129, 0.2); border-color: transparent; color: var(--brand-green); }
    .step-line { width: 32px; height: 2px; margin: 0 8px; background: var(--text-secondary); opacity: 0.3; }
    @media (max-width: 1300px) and (min-width: 860px) { .method-tabs { gap: 4px; } .tab-name { font-size: 8.5px; } .tab-icon { width: 16px; height: 16px; min-width: 16px; } .method-tab { padding: 8px 4px; } }
    @media (max-width: 860px) { .sidebar-root { padding: 12px 10px 10px; } }
    .method-tabs-section { margin-bottom: 24px; }
    .method-tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; width: 100%; box-sizing: border-box; }
    .method-tab { width: 100%; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(15, 23, 42, 0.4); color: #94a3b8; transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; position: relative; overflow: visible; }
    .method-tab:hover { background: color-mix(in srgb, var(--m-color) 12%, rgba(15, 23, 42, 0.4)); border-color: color-mix(in srgb, var(--m-color) 50%, transparent); color: var(--m-color); transform: none; }
    .method-tab.selected { background: color-mix(in srgb, var(--m-color) 15%, rgba(15, 23, 42, 0.4)); border-color: color-mix(in srgb, var(--m-color) 60%, transparent); box-shadow: 0 0 16px -2px color-mix(in srgb, var(--m-color) 30%, transparent); color: var(--m-color); transform: none; }
    .tab-icon { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; margin-bottom: 2px; transition: transform 2.5s cubic-bezier(0.19, 1, 0.22, 1); will-change: transform; }
    .method-tab:active .tab-icon { transform: rotate(-70deg) scale(1.8); }
    .method-tab:active { transform: none; }
    .tab-name { font-size: 10px; font-weight: 600; text-align: center; width: 100%; }
    .net-icons { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 8px; }
    .mc, .net-icons svg { opacity: 0.2; transition: opacity 0.3s ease; }
    .active-net { opacity: 1 !important; }
    .input-group label { display: block; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 10px; }
    .icon-input input { position: relative; width: 100%; padding: 16px 18px !important; border-radius: 12px !important; background: rgba(15, 23, 42, 0.5) !important; border: 1px solid var(--glass-border) !important; color: var(--text-primary) !important; font-size: 15px !important; }
    .icon-input svg { position: absolute; left: 16px; pointer-events: none; color: var(--text-secondary); }
    .icon-input.has-icon input { padding-left: 48px !important; }
    .pay-btn { width: 100% !important; padding: 14px !important; border-radius: 12px !important; font-size: 16px !important; font-weight: 600 !important; margin-top: 10px; }
    .order-summary { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; }
    .summary-header { padding: 14px !important; display: flex; justify-content: space-between; align-items: center; width: 100%; background: none; border: none; cursor: pointer; }
    .sh-left { display: flex; align-items: center; gap: 12px; }
    .bag-icon-wrap { width: 40px; height: 40px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
    .sh-title { font-size: 14px; font-weight: 600; color: #f8fafc; text-align: left; }
    .sh-items { font-size: 11px; color: #64748b; text-align: left; margin-top: 1px; }
    .sh-right { display: flex; align-items: center; gap: 8px; }
    .sh-total { font-size: 15px; font-weight: 700; color: #f8fafc; }
    .chev { color: #475569; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .chev.open { transform: rotate(180deg); }
    
    .tab-sub { display: none; }
    @media (max-width: 860px) { .sidebar-root { padding: 12px 10px 10px; } }
    
    .item-row { padding: 12px 14px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .item-icon-wrap { width: 36px; height: 36px; border-radius: 10px; background: rgba(16, 185, 129, 0.1); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .item-body { flex: 1; min-width: 0; }
    .item-name { font-size: 13px; font-weight: 600; color: #f8fafc; margin-bottom: 2px; }
    .item-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; white-space: pre-line; }
    .item-qty { font-size: 10px; color: var(--brand-green); font-weight: 500; margin-top: 4px; }
    .item-price { font-size: 13px; font-weight: 600; color: #f8fafc; }
    
    .breakdown { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .br-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #94a3b8; }
    .with-icon { display: flex; align-items: center; gap: 6px; }
    .green { color: #10b981 !important; }
    .discount-row { background: rgba(16, 185, 129, 0.05); margin: 0 -4px; padding: 4px 18px; border-radius: 6px; }
    
    .promo-row { padding: 16px 14px; display: flex; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .promo-input { flex: 1; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 12px; font-size: 13px; color: #fff; }
    .apply-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0 16px; font-size: 13px; font-weight: 500; color: #fff; transition: all 0.2s; }
    .apply-btn:hover { background: rgba(255,255,255,0.1); }
    
    .total-row { padding: 20px 14px; display: flex; justify-content: space-between; align-items: center; background: rgba(16, 185, 129, 0.02); }
    .total-label { font-size: 15px; font-weight: 600; color: #f8fafc; }
    .gst-note { font-size: 11px; color: #64748b; margin-top: 2px; }
    .total-price { font-size: 20px; font-weight: 700; color: #10b981; }
    
    .trust-row { padding: 16px; display: flex; justify-content: center; align-items: center; gap: 12px; background: rgba(15, 23, 42, 0.2); }
    .trust-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; font-weight: 500; }
    .trust-sep { color: rgba(255,255,255,0.1); }
    
    .upi-qr-scan-area { background: rgba(15, 23, 42, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; gap: 20px; margin-top: 10px; transition: all 0.5s ease; }
    .qr-main-box { width: 140px; height: 140px; background: #ffffff; border-radius: 18px; position: relative; padding: 12px; box-shadow: 0 0 40px rgba(0, 0, 0, 0.4); }
    .qr-grid-overlay { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 1px; border: 2px solid #000000; border-radius: 8px; background: #000000; overflow: hidden; }
    .grid-row { flex: 1; display: flex; gap: 1px; }
    .grid-row span { flex: 1; background: #ffffff; }
    .qr-helper-text { color: rgba(255, 255, 255, 0.5); font-size: 13px; font-weight: 500; text-align: center; margin: 0; }
    .skeleton-line {
      background: rgba(255, 255, 255, 0.05);
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0.05) 25%, 
        rgba(255, 255, 255, 0.1) 50%, 
        rgba(255, 255, 255, 0.05) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .invoice-content { 
      padding: 32px; 
      color: #334155; 
      background: #ffffff; 
      border-radius: 20px;
      margin: 12px;
      font-family: 'Inter', sans-serif;
    }
    .invoice-main-title { 
      font-size: 24px; 
      font-weight: 800; 
      text-align: center; 
      margin-bottom: 32px; 
      letter-spacing: 0.05em; 
      color: #1e293b;
      text-transform: uppercase;
    }
    .invoice-meta-grid { 
      display: grid; 
      grid-template-columns: 80px 1fr; 
      gap: 12px 24px; 
      margin-bottom: 40px; 
    }
    .meta-item { display: contents; }
    .meta-label { font-size: 14px; color: #1e293b; font-weight: 500; }
    .meta-value { font-size: 14px; font-weight: 400; color: #334155; }
    .meta-value.multi { line-height: 1.5; }
    
    .invoice-table-container { margin-bottom: 0; }
    .invoice-table { width: 100%; border-collapse: collapse; }
    .invoice-table th { 
      padding: 12px 4px; 
      border-bottom: 1.5px solid #1e293b; 
      font-size: 15px; 
      color: #1e293b; 
      font-weight: 700; 
    }
    .invoice-table td { 
      padding: 12px 4px; 
      font-size: 14px; 
      color: #475569;
      vertical-align: top;
    }
    .item-name-td { width: 45%; line-height: 1.4; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }

    .invoice-calc-footer { 
      display: flex; 
      flex-direction: column; 
      padding-top: 12px; 
      border-top: 1.5px solid #1e293b; 
    }
    .calc-row { 
      display: grid; 
      grid-template-columns: 1fr 100px; 
      gap: 20px; 
      padding: 8px 4px;
      font-size: 14px; 
    }
    .calc-label { color: #1e293b; font-weight: 500; text-align: left; }
    .calc-value { color: #1e293b; font-weight: 400; text-align: right; }
    .pink-text { color: #e11d48 !important; }
    
    .calc-total-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-top: 8px; 
      padding: 16px 4px; 
      border-top: 1.5px solid #1e293b; 
    }
    .total-text { font-size: 15px; font-weight: 500; color: #1e293b; }
    .total-val { font-size: 18px; font-weight: 600; color: #1e293b; }

    .invoice-icon { background: rgba(16,185,129,0.1); color: #10b981; }
    .order-summary.invoice-mode { border: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.4); }
  `]
})
export class PaymentCardComponent implements OnInit, AfterViewInit {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;
  @ViewChild('scrollTrack') scrollTrack!: ElementRef;
  @Output() methodChange = new EventEmitter<string>();
  @Output() cardTypeChange = new EventEmitter<string>();
  @Output() totalAmountChange = new EventEmitter<number>();

  selectedMethod = signal('card');
  detectedCardType = signal('visa');
  isProcessing = signal(false);
  isStripeLoading = signal(false);
  showSummary = signal(true);
  loadingOrder = signal(true);

  items = signal<any[]>([]);
  subtotal = signal(0);
  tax = signal(0);
  fees = signal(0);
  discount = signal(0);
  totalAmount = signal(0);
  paytoEmail = signal('');
  paytoName = signal('');
  paytoID = signal('');

  isInvoice = signal(false);
  invoiceNo = signal('');
  issueDate = signal('');
  customerName = signal('');
  merchantName = signal('');
  merchantEmail = signal('');
  merchantPhone = signal('');

  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  toastMessage = signal('');
  allMethods = [
    {
      id: 'card', name: 'Card', color: '#3b82f6',
      svg: '<div style="display:flex; align-items:center; gap: 2px;"><svg style="width:16px; height:12px;" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#1A1F71"></rect><path d="M19.5 21h-3.2l2-12.4h3.2L19.5 21zm13.3-12.1c-.6-.3-1.6-.5-2.9-.5-3.2 0-5.4 1.7-5.4 4.1 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.7c.7.3 2.1.6 3.5.6 3.4 0 5.6-1.7 5.6-4.2 0-1.4-.8-2.5-2.7-3.4-1.1-.6-1.8-.9-1.8-1.5 0-.5.6-1 1.8-1 1 0 1.8.2 2.4.5l.3.1.4-2.7z" fill="#fff"></path><path d="M37.3 8.6h-2.5c-.8 0-1.3.2-1.7 1L28.8 21h3.4l.7-1.9h4.1l.4 1.9H40L37.3 8.6zm-3.5 8.1l1.7-4.7.5 2.3.5 2.4h-2.7z" fill="#fff"></path><path d="M15.6 8.6L12.4 17l-.3-1.7c-.6-2-2.4-4.2-4.4-5.3l2.9 11h3.4l5.1-12.4h-3.5z" fill="#fff"></path><path d="M9.8 8.6H4.6l-.1.3c4 1 6.7 3.5 7.8 6.5l-1.1-5.7c-.2-.8-.8-1-1.4-1.1z" fill="#F7B600"></path></svg><svg style="width:16px; height:12px;" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#252525"></rect><circle cx="19" cy="16" r="8" fill="#EB001B"></circle><circle cx="29" cy="16" r="8" fill="#F79E1B"></circle><path d="M24 10.3a8 8 0 010 11.4 8 8 0 010-11.4z" fill="#FF5F00"></path></svg><svg style="width:16px; height:12px;" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#2E77BC"></rect><path d="M6 16l3-8h4l3 8-3 8H9L6 16zm12-8h10l2 3 2-3h10l-6 8 6 8H32l-2-3-2 3H18l6-8-6-8z" fill="#fff" opacity="0.9"></path></svg></div>'
    },
    {
      id: 'apple', name: 'Apple Pay', color: '#e2e8f0',
      svg: '<svg style="width:20px; height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path></svg>'
    },
    {
      id: 'google', name: 'Google Pay', color: '#0ea5e9',
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

  methods: any[] = [];

  orderID = '';
  merId = '';
  paymentId = '';
  useBackend = false;

  stripe: any;
  elements: any;
  paymentElement: any;

  stripeMethods = ['card', 'apple', 'google', 'klarna', 'afterpay', 'zip', 'link'];

  backendMap: { [key: string]: string } = {
    'card': 'card',
    'apple': 'applePay',
    'google': 'googlePay',
    'klarna': 'klarna',
    'afterpay': 'afterPay',
    'zip': 'zipPay',
    'link': 'payWithLink'
  };

  stripeTypeMap: { [key: string]: string } = {
    'card': 'card',
    'applePay': 'apple_pay',
    'googlePay': 'google_pay',
    'klarna': 'klarna',
    'afterPay': 'afterpay_clearpay',
    'zipPay': 'zip',
    'payWithLink': 'link'
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.merId = params['merId'] || '';
      this.orderID = params['orderId'] || '';
      this.paymentId = params['paymentId'] || '';
      this.useBackend = !!this.paymentId;

      this.startApiFlow();
    });

    try {
      this.stripe = Stripe("pk_test_51Q0xUnBrVsb68zkxVIQXjAHQqONjjk6jyFoE9HQ7zIn44MszuDGs6QT97k6QKQhNUfs7b54dVTV6A6tumWvD3nU200nU1Q1Yel");
    } catch (e) {
      console.error("Stripe.js not loaded", e);
    }
  }

  showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(''), 4000);
  }

  private generateDeviceId(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async startApiFlow() {
    this.loadingOrder.set(true);

    if (this.paymentId) {
      this.orderService.checkPaymentLinkStatus(this.paymentId).subscribe({
        next: (res) => {
          if (res.success) {
            this.showToast("Payment link is active");
          }
        },
        error: (err) => console.error("Error checking payment status", err)
      });
    }

    this.orderService.getOrderItems(this.orderID, this.useBackend).subscribe({
      next: (response) => {
        if (response && response.data) {
          const orderData = response.data;
          this.handleOrderResponse(orderData);

          const deviceId = this.generateDeviceId();
          const merchantID = orderData.merchantID;

          this.orderService.generateToken(merchantID, deviceId, this.useBackend).subscribe({
            next: (tokenRes) => {
              const token = tokenRes.data.token || tokenRes.data.deviceID;
              const accessToken = tokenRes.data.token;

              if (accessToken) {
                this.orderService.getMyPaymentMethod(accessToken, deviceId, this.useBackend).subscribe({
                  next: (methodsRes) => {
                    this.filterMethods(methodsRes.data.paymentMethods);
                  },
                  error: (err) => {
                    console.error("Error fetching payment methods", err);
                    this.methods = [...this.allMethods];
                  }
                });
              } else {
                this.methods = [...this.allMethods];
              }
            },
            error: (err) => {
              console.error("Error generating token", err);
              this.methods = [...this.allMethods];
            }
          });
        }
        this.loadingOrder.set(false);
      },
      error: (error) => {
        console.error('Error fetching order items:', error);
        this.loadingOrder.set(false);
        this.methods = [...this.allMethods];
      }
    });
  }

  private handleOrderResponse(orderData: any) {
    if (orderData.orderedThrough === 'QR' && orderData.qrTableData) {
      this.items.set([{
        name: 'QR Payment',
        price: orderData.amount || 0,
        desc: `Name: ${orderData.qrTableData.name || 'N/A'} | Email: ${orderData.qrTableData.email || 'N/A'} | Phone: ${orderData.qrTableData.phone || 'N/A'} | Location: ${orderData.qrTableData.tableNumber || 'N/A'}`,
        qty: orderData.qrTableData.quantity || 1
      }]);
    } else if (Array.isArray(orderData.menuList)) {
      this.items.set(orderData.menuList.map((item: any) => ({
        name: item.itemName || 'Unknown Item',
        price: item.itemPrice || item.perItemPrice || item.amount || 0,
        desc: item.description || '',
        qty: item.quantity || 1
      })));
    }

    this.subtotal.set(orderData.subTotal || orderData.prevAmt || orderData.amount || 0);
    this.tax.set(parseFloat(orderData.gstAmount || orderData.GSTAmt || 0));
    this.fees.set(orderData.plateformFees || 0);
    this.discount.set(orderData.discount || 0);
    this.totalAmount.set(orderData.finalAmount || orderData.totalAmount || 0);
    this.totalAmountChange.emit(this.totalAmount());
    this.isInvoice.set(orderData.orderedThrough === 'invoice');
    if (orderData.invoiceDetails) {
      this.invoiceNo.set(orderData.invoiceDetails.invoiceNo || '');
      this.issueDate.set(orderData.invoiceDetails.issueDate || '');
      this.customerName.set(orderData.invoiceDetails.invoiceTitle || '');
    }
    if (orderData.merchantData) {
      this.merchantName.set(orderData.merchantData.name || '');
      this.merchantEmail.set(orderData.merchantData.email || '');
      this.merchantPhone.set(orderData.merchantData.mobile || '');
    }
  }

  private filterMethods(apiMethods: string[]) {
    const apiMap: { [key: string]: string } = {
      'card': 'card',
      'Card': 'card',
      'applePay': 'apple',
      'Apple Pay': 'apple',
      'googlePay': 'google',
      'Google Pay': 'google',
      'zipPay': 'zip',
      'Zip Pay': 'zip',
      'afterPay': 'afterpay',
      'After Pay': 'afterpay',
      'klarnaPay': 'klarna',
      'Klarna Pay': 'klarna',
      'payWithLink': 'link',
      'Pay with Link': 'link',
      'kuberId': 'upi',
      'pay2': 'payto',
    };

    const allowedIds = apiMethods.map(m => apiMap[m]).filter(id => !!id);

    const uniqueIds = Array.from(new Set(allowedIds));
    this.methods = this.allMethods.filter(m => uniqueIds.includes(m.id));


    if (this.methods.length === 0) {
      this.methods = [...this.allMethods];
    }

    if (!this.methods.find(m => m.id === this.selectedMethod())) {
      this.selectMethod(this.methods[0]?.id || 'card');
    }
  }

  fetchOrderDetails() {
    // Replaced by startApiFlow
  }

  ngAfterViewInit() {

    if (this.isStripeMethod()) {
      this.initStripeElement(this.selectedMethod());
    }
  }

  isStripeMethod() {
    return this.stripeMethods.includes(this.selectedMethod());
  }

  async initStripeElement(id: string) {

    if (this.paymentElement) {
      try {
        this.paymentElement.unmount();
        this.paymentElement.destroy();
        this.paymentElement = null;
      } catch (e) {
        console.warn("Error destroying previous element:", e);
      }
    }

    const backendType = this.backendMap[id];
    if (!backendType) return;

    const stripeType = this.stripeTypeMap[backendType];
    console.log(`[Stripe] Initializing ${id} (${backendType})...`);
    this.isStripeLoading.set(true);

    try {
      const res = await fetch("https://backend.kuberfinancial.com.au/api/payments/createPaymentSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentType: backendType })
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      if (!data.clientSecret) throw new Error("No clientSecret received from backend");

      this.elements = this.stripe.elements({
        clientSecret: data.clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#10b981',
            colorBackground: '#1e293b',
            colorText: '#ffffff',
            borderRadius: '12px'
          }
        }
      });

      console.log(`[Stripe] Creating ${stripeType} element...`);

      this.paymentElement = this.elements.create("payment", {
        layout: 'tabs',
        paymentMethodOrder: [stripeType]
      });



      setTimeout(() => {
        const mountPoint = document.getElementById("stripe-payment-element-mount-point");
        if (mountPoint && this.paymentElement) {
          this.paymentElement.mount("#stripe-payment-element-mount-point");
        }
      }, 50);

      this.paymentElement.on('ready', () => {
        console.log(`[Stripe] ${id} UI Ready.`);
        this.isStripeLoading.set(false);
      });

      this.paymentElement.on('change', (event: any) => {
        if (event.error) {
          console.error("[Stripe Change Error]:", event.error.message);
        }
      });

    } catch (e: any) {
      console.error("[Stripe Init Error]:", e.message);
      this.isStripeLoading.set(false);
    }
  }

  onCardNumberInput(event: any) {
    const val = event.target.value.replace(/\s+/g, '');
    let type = 'visa'; // Default as requested
    if (val.startsWith('5')) type = 'mastercard';
    else if (val.startsWith('3')) type = 'amex';

    this.detectedCardType.set(type);
    this.cardTypeChange.emit(type);
  }

  private isDragging = false;
  private dragStartX = 0;
  private scrollStartX = 0;

  private isThumbDragging = false;
  private thumbDragStartX = 0;
  private thumbDragStartLeft = 0;

  thumbWidth = 60;
  thumbLeft = 0;

  constructor() {
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

  async selectMethod(id: string) {
    this.selectedMethod.set(id);
    this.methodChange.emit(id);

    if (this.isStripeMethod()) {
      await this.initStripeElement(id);
    }
  }

  getMethodName() {
    return this.methods.find(m => m.id === this.selectedMethod())?.name ?? 'Pay';
  }

  getCTA() {
    const method = this.selectedMethod();
    const amountStr = this.totalAmount().toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    if (method === 'payto') return `Authorize ${amountStr}`;
    if (method === 'zip') return 'Continue with Zip';
    if (method === 'afterpay') return 'Continue with Afterpay';
    if (method === 'klarna') return 'Pay first instalment';
    if (method === 'upi') return `Verify & Pay ${amountStr}`;
    return `Pay ${amountStr}`;
  }

  toggleSummary() {
    this.showSummary.set(!this.showSummary());
  }

  @Output() paymentSuccess = new EventEmitter<void>();

  async pay() {
    this.isProcessing.set(true);

    if (this.selectedMethod() === 'payto') {
      try {
        console.log("[PayTo] Creating customer...");
        const customerResponse = await fetch("https://backend.kuberfinancial.com.au/api/payments/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.paytoEmail(),
            name: this.paytoName()
          })
        });
        const customerData = await customerResponse.json();
        const customerId = customerData.id;

        console.log("[PayTo] Creating payment...");
        const paymentResponse = await fetch("https://backend.kuberfinancial.com.au/api/payments/createPayToPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: customerId,
            amount: this.totalAmount()
          })
        });
        const paymentData = await paymentResponse.json();
        const clientSecret = paymentData.clientSecret;

        console.log("[PayTo] Confirming payment...");
        const result = await this.stripe.confirmPayToPayment(
          clientSecret,
          {
            payment_method: {
              billing_details: {
                name: this.paytoName(),
                email: this.paytoEmail()
              },
              payto: {
                pay_id: this.paytoID()
              }
            }
          }
        );

        if (result.error) {
          console.error(result.error.message);
          alert(result.error.message);
        } else {
          console.log("PayTo request sent");
          this.paymentSuccess.emit();
        }
      } catch (err: any) {
        console.error("PayTo Error:", err);
      } finally {
        this.isProcessing.set(false);
      }
      return;
    }

    if (this.isStripeMethod() && this.paymentElement) {
      try {
        const { error } = await this.stripe.confirmPayment({
          elements: this.elements,
          confirmParams: {
            return_url: window.location.origin + '/success',
          },
        });

        if (error) {
          console.error(error.message);
        }
      } catch (e) {
        console.error("Payment confirmation failed", e);
      } finally {
        this.isProcessing.set(false);
      }
    } else {
      setTimeout(() => {
        this.isProcessing.set(false);
        this.paymentSuccess.emit();
      }, 2000);
    }
  }
}
