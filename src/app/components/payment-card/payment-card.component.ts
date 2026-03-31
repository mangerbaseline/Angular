import { Component, signal, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, CurrencyPipe],
  template: `
    <div class="sidebar-root">

      <!-- Step Indicator (pill style, top) -->
      <div class="steps-bar">
        <div class="step-pill active">
          <svg viewBox="0 0 16 16" fill="none" width="12"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M1 7h14" stroke="currentColor" stroke-width="1.5"/></svg>
          Card Details
        </div>
        <div class="step-line"></div>
        <div class="step-pill">
          <svg viewBox="0 0 16 16" fill="none" width="12"><path d="M8 1.333l5.333 2v5.334c0 3.083-2.5 5.916-5.333 7-2.833-1.084-5.333-3.917-5.333-7V3.333L8 1.333z" stroke="currentColor" stroke-width="1.5"/></svg>
          Verification
        </div>
        <div class="step-line"></div>
        <div class="step-pill">
          <svg viewBox="0 0 16 16" fill="none" width="12"><path d="M13 4L6.5 11 3 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Complete
        </div>
      </div>

      <!-- Method tabs with drag-scroll & navigation arrows -->
      <div class="method-tabs-section">
        <div class="method-tabs"
          #tabsContainer
          (mousedown)="onTabsDragStart($event)"
          (mousemove)="onTabsDragMove($event)"
          (mouseup)="onTabsDragEnd()"
          (mouseleave)="onTabsDragEnd()"
          (scroll)="onTabsScroll($event)">
          <button
            *ngFor="let m of methods"
            [class.selected]="selectedMethod() === m.id"
            (click)="selectMethod(m.id)"
            class="method-tab">
            <span class="tab-icon" [innerHTML]="m.svg | safeHtml"></span>
            <div class="tab-text">
              <span class="tab-name">{{ m.name }}</span>
              <span class="tab-sub">{{ m.sub }}</span>
            </div>
          </button>
        </div>
        <!-- Scrollbar indicator track with arrows -->
        <div class="scroll-track-container">
          <button class="scroll-nav-btn left" (click)="moveTabs('left')">
            <svg viewBox="0 0 16 16" width="10" height="10"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          </button>
          <div class="scroll-track" #scrollTrack>
            <div class="scroll-thumb" 
              [style.width.px]="thumbWidth" 
              [style.left.px]="thumbLeft"
              (mousedown)="onThumbStartDrag($event)"></div>
          </div>
          <button class="scroll-nav-btn right" (click)="moveTabs('right')">
            <svg viewBox="0 0 16 16" width="10" height="10"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          </button>
        </div>
      </div>

      <!-- Dynamic Form Area -->
      <div class="form-area">
        <div [ngSwitch]="selectedMethod()" class="form-switch">

          <!-- CARD -->
          <div *ngSwitchCase="'card'" class="payment-form fade-in">
            <div class="input-group">
              <label>Card Number</label>
              <div class="icon-input">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
                <input type="text" placeholder="1234 5678 9012 3456">
                <div class="net-icons">
                  <div class="mc"><div class="mc-r"></div><div class="mc-o"></div></div>
                  <svg viewBox="0 0 38 14" width="24"><text y="12" font-size="11" fill="#1434CB" font-weight="800">VISA</text></svg>
                </div>
              </div>
            </div>
            <div class="input-group">
              <label>Cardholder Name</label>
              <div class="icon-input">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="John Doe">
              </div>
            </div>
            <div class="row-2col">
              <div class="input-group">
                <label>Expiry Date</label>
                <div class="icon-input">
                  <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  <input type="text" placeholder="MM/YY">
                </div>
              </div>
              <div class="input-group">
                <label>Security Code</label>
                <div class="icon-input">
                  <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
              <label>Account Number</label>
              <div class="icon-input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M12 10v11M4 10l8-7 8 7"/></svg>
                <input type="text" placeholder="Enter your account number">
              </div>
            </div>
            <div class="input-group">
              <label>BSB Number</label>
              <div class="icon-input">
                <input type="text" placeholder="000-000">
              </div>
            </div>
            <div class="input-group">
              <label>Account Holder Name</label>
              <div class="icon-input">
                <input type="text" placeholder="John Doe">
              </div>
            </div>
          </div>

          <!-- UPI -->
          <div *ngSwitchCase="'upi'" class="payment-form fade-in">
            <div class="input-group">
              <label>UPI ID</label>
              <div class="icon-input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                <input type="text" placeholder="yourname@upi">
              </div>
            </div>
          </div>

          <!-- PayTo -->
          <div *ngSwitchCase="'payto'" class="payment-form fade-in">
            <h3 class="form-title">Bank-grade Security</h3>
            <p class="form-subtitle">Real-time authorization</p>
            <div class="input-group">
              <label>BSB NUMBER</label>
              <div class="icon-input">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                <input type="text" placeholder="000-000">
              </div>
            </div>
            <div class="input-group">
              <label>ACCOUNT NUMBER</label>
              <div class="icon-input">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="text" placeholder="Enter your account number">
              </div>
            </div>
            <div class="input-group">
              <label>ACCOUNT NAME</label>
              <div class="icon-input">
                <svg class="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="John Doe">
              </div>
            </div>
            <div class="info-row">
               <svg viewBox="0 0 16 16" fill="#10b981" width="14"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 11h-7l3.5-6 3.5 6z"/></svg>
               <span>Direct debit with instant confirmation</span>
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
      <div class="cta-section">
        <button class="pay-btn" (click)="pay()" [class.loading]="isProcessing()">
          <ng-container *ngIf="!isProcessing()">
            {{ getCTA() }}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" width="18"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
          </ng-container>
          <div class="spinner" *ngIf="isProcessing()"></div>
        </button>
        <p class="cta-note">0% interest • No hidden fees • Approval in seconds</p>
        <p class="tos-text">By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
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
  styles: []
})
export class PaymentCardComponent {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;
  @ViewChild('scrollTrack') scrollTrack!: ElementRef;
  @Output() methodChange = new EventEmitter<string>();

  selectedMethod = signal('card');
  isProcessing = signal(false);
  showSummary = signal(true);

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
      id: 'card', name: 'Card', sub: 'Visa, MC, Amex',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>'
    },
    {
      id: 'apple', name: 'Apple Pay', sub: 'Touch to pay',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>'
    },
    {
      id: 'google', name: 'Google Pay', sub: 'Fast checkout',
      svg: '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="6" cy="12" r="4" fill="#4285F4"/><circle cx="10" cy="12" r="4" fill="#EA4335"/><circle cx="14" cy="12" r="4" fill="#FBBC05"/><circle cx="18" cy="12" r="4" fill="#34A853"/></svg>'
    },
    {
      id: 'bank', name: 'Bank', sub: 'Direct transfer',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M12 10v11M4 10l8-7 8 7"/></svg>'
    },
    {
      id: 'upi', name: 'UPI', sub: 'Scan & Pay',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>'
    },
    {
      id: 'payto', name: 'PayTo', sub: 'Real-time',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><path d="M17 8l4 4-4 4M3 12h18"/></svg>'
    },
    {
      id: 'zip', name: 'Zip', sub: 'Pay in 4',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><circle cx="12" cy="12" r="10"/><path d="M9 9h6l-6 6h6"/></svg>'
    },
    {
      id: 'afterpay', name: 'Afterpay', sub: 'Pay later',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
    },
    {
      id: 'klarna', name: 'Klarna', sub: 'Flexible',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="100%" height="100%"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M9 12l2 2 4-4"/></svg>'
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

  pay() {
    this.isProcessing.set(true);
    setTimeout(() => this.isProcessing.set(false), 2000);
  }
}
