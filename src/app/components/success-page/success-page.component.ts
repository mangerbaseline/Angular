import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

import * as CryptoJS from 'crypto-js';
import { toPng, toBlob } from 'html-to-image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-layout anim-fade-in" [class.event-mode]="isEvent()">
      
      <!-- DEFAULT SUCCESS DESIGN -->
      <div *ngIf="!isEvent()" class="success-container">
        <div id="receipt-content" class="u-glass u-rounded-3xl u-p-8 u-space-y-6 max-w-lg u-w-full">
          <div class="u-flex u-flex-col u-items-center u-text-center">
            <div class="u-relative">
              <div class="u-absolute u-inset-0 rounded-full bg-primary-glow blur-xl anim-pulse-glow" style="transform: scale(1.18699);"></div>
              <div class="u-relative w-24 h-24 rounded-full u-flex u-items-center u-justify-center" style="background: linear-gradient(135deg, #2fc755ff 0%, #3b9162ff 40%, #dcec47ff 70%, #d2d440ff 100%);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-12 h-12 text-primary-foreground"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
              </div>
            </div>
            <div class="u-mt-6">
              <h1 class="u-text-3xl u-font-bold text-foreground mb-2" style="font-family: 'Space Grotesk', sans-serif;">
                Payment Successful!</h1>
              <p class="text-muted-foreground">Your payment of <span class="u-text-gradient u-font-semibold">{{ orderService.totalAmount() | currency }}</span> has been processed</p>
            </div>  
          </div>
          <div *ngIf="orderService.orderData()?.merchantData?.profile_pic && isMerchantImageValid() && (orderService.orderData()?.merchantData?.profile_pic?.startsWith('http'))" class="u-flex u-items-center u-justify-center u-gap-3 u-p-4 u-rounded-xl bg-secondary-50">
            <div style="width: 48px; height: 48px; min-width: 48px; border-radius: 50%;" class="bg-slate-800 u-flex u-items-center u-justify-center overflow-hidden border border-border-50">
               <img [src]="orderService.orderData()?.merchantData?.profile_pic" 
                    crossOrigin="anonymous"
                    (error)="handleMerchantImageError()"
                    style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="u-text-left"><p class="text-sm text-muted-foreground">Paid to</p><p class="u-font-semibold text-foreground">{{ orderService.orderData()?.merchantData?.name || 'TechStore Pro' }}</p></div>
          </div>
          <div *ngIf="!orderService.orderData()?.merchantData?.profile_pic || !isMerchantImageValid() || !(orderService.orderData()?.merchantData?.profile_pic?.startsWith('http'))" class="u-flex u-items-center u-justify-center u-p-4">
             <div class="u-text-center"><p class="text-sm text-muted-foreground">Paid to</p><p class="u-text-xl u-font-bold text-foreground">{{ orderService.orderData()?.merchantData?.name || 'TechStore Pro' }}</p></div>
          </div>
          <div class="u-space-y-4">
            <div class="border-t border-border-50 pt-4">
              <h2 class="text-sm font-medium text-muted-foreground mb-3 u-flex u-items-center u-gap-2" style="font-family: 'Space Grotesk', sans-serif;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt w-4 h-4"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17.5v-11"></path></svg>Transaction Details
              </h2>
              <div class="u-space-y-3 text-sm">
                <div class="u-flex u-justify-between"><span class="text-muted-foreground">Transaction ID</span><button class="transaction-button u-flex u-items-center u-gap-2"><span class="text-xs">{{ orderService.orderData()?.txn_id || 'Generating...' }}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-3 h-3"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div>
                <div class="u-flex u-justify-between"><span class="text-muted-foreground">Date & Time</span><span class="text-foreground u-text-right text-xs">{{ (orderService.orderData()?.addedOn * 1000) | date:"EEEE, d MMMM yyyy 'at' h:mm a" }}</span></div>
                <div class="u-flex u-justify-between">
                  <span class="text-muted-foreground">Payment Method</span>
                  <div class="u-flex u-items-center" style="gap: 8px;">
                    <img *ngIf="getPaymentIcon()" [src]="getPaymentIcon()" style="width: 20px; height: 16px; object-fit: contain;">
                    <span *ngIf="isZipPay()" style="font-weight:800; font-size:16px; letter-spacing:-0.02em; background: linear-gradient(to right, #a78bfa, #e879f9); -webkit-background-clip: text; color: transparent;">zip</span>
                    <span class="text-foreground">{{ orderService.orderData()?.paymentMode || 'Stripe' }}</span>
                  </div>
                </div>
                <div class="u-flex u-justify-between"><span class="text-muted-foreground">Status</span><span class="status-primary font-medium u-flex u-items-center" style="gap: 10px;"><div class="w-2 h-2 u-rounded-full bg-primary animate-pulse"></div>{{ orderService.orderData()?.paymentStatus || 'Completed' }}</span></div>
              </div>
            </div>

            <!-- Customer & Item Details Section -->
            <div *ngIf="orderService.orderData()?.menuList?.length" class="border-t border-border-50 pt-4">
              <h2 class="text-sm font-medium text-muted-foreground mb-3 u-flex u-items-center u-gap-2" style="font-family: 'Space Grotesk', sans-serif;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Order Items & Customer Details
              </h2>
              <div class="u-space-y-4 pt-2">
                <div *ngFor="let item of orderService.orderData()?.menuList" class="u-bg-secondary-30 u-rounded-xl u-p-4 border border-border-30">
                  <div class="u-flex u-justify-between u-items-start mb-3">
                    <div *ngIf="item.firstName || item.lastName">
                      <h3 class="u-font-semibold text-foreground">{{ item.firstName }} {{ item.lastName }}</h3>
                    </div>
                    <img *ngIf="item.image && (item.image.startsWith('http') || item.image.startsWith('https'))" 
                         [src]="item.image" 
                         crossOrigin="anonymous"
                         style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);">
                  </div>
                  <div class="u-grid u-grid-cols-1 u-gap-2 text-[11px]">
                    <div class="u-flex u-items-center u-gap-2 text-muted-foreground" *ngIf="item.mobile">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      {{ item.mobile }}
                    </div>
                    <div class="u-flex u-items-start u-gap-2 text-muted-foreground" *ngIf="item.streetName || item.city || item.state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span class="flex-1">
                        {{ item.streetNumber }} {{ item.streetName }}{{ item.streetName && (item.city || item.state) ? ',' : '' }} {{ item.city }}{{ item.city && item.state ? ',' : '' }} {{ item.state }} {{ item.postal }} {{ item.country }}
                      </span>
                    </div>
                    <div *ngIf="item.aboutEvent" class="u-mt-2 u-p-2 rounded bg-black/20 text-muted-foreground italic border-l-2 border-primary">
                      "{{ item.aboutEvent }}"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-border-50 pt-4">
              <h2 class="text-sm font-medium text-muted-foreground mb-5" style="font-family: 'Space Grotesk', sans-serif;">Order Summary</h2>
              <div class="u-space-y-4 text-sm pt-4 border-t border-border-30">
                <div class="u-flex u-justify-between u-font-semibold pt-2"><span class="text-foreground">Total Paid</span><span class="u-text-gradient">{{ orderService.totalAmount() | currency }}</span></div>
              </div>
            </div>
          </div>
          <div class="u-space-y-3 pt-2">
            <button *ngIf="orderService.orderData()?.url" (click)="onReturn()" class="return-btn u-relative u-w-full py-4 px-6 u-rounded-2xl u-flex u-items-center u-justify-center u-gap-3 transition-all duration-300 overflow-hidden bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground u-font-semibold shadow-lg shadow-primary-25 hover:-translate-y-0.5 hover:shadow-[0_20px_20px_rgba(16,185,129,0.5)]" tabindex="0">
              <div class="shine-effect"></div>
              <span class="u-relative u-flex u-items-center u-gap-2" style="font-family: 'Inter', sans-serif;">
                Redirecting to {{ orderService.orderData()?.merchantData?.name || 'Shop' }} in {{ countdown() }}...
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link w-5 h-5"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
              </span>
            </button>
            <div *ngIf="!orderService.orderData()?.url" class="u-w-full py-4 px-6 u-rounded-2xl u-flex u-items-center u-justify-center u-gap-3 bg-white/5 text-white/50 border border-white/10 font-semibold" style="font-family: 'Inter', sans-serif;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
              Payment Confirmed Successfully
            </div>
            <div class="u-grid u-grid-cols-2 u-gap-3">
              <button (click)="downloadReceipt()" class="action-btn u-flex u-flex-col u-items-center u-gap-2 u-p-4 u-rounded-2xl bg-secondary-50 hover-bg-secondary transition-colors" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download w-5 h-5 text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg><span class="text-xs text-muted-foreground">Receipt</span></button>
              <button (click)="shareReceipt()" class="action-btn u-flex u-flex-col u-items-center u-gap-2 u-p-4 u-rounded-2xl bg-secondary-50 hover-bg-secondary transition-colors" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2 w-5 h-5 text-primary"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg><span class="text-xs text-muted-foreground">Share</span></button>
            </div>
          </div>
          <p class="u-text-center text-xs text-muted-fg-60 pt-4">A confirmation email has been sent to your registered email address.<br>Powered by <span class="text-gradient-gold u-font-semibold">KuberPay</span></p>
        </div>
      </div>

      <!-- EVENT BOOKING SUCCESS DESIGN -->
      <div *ngIf="isEvent()" class="event-success-container">
        <!-- Header -->
        <div class="event-header">
          <div class="header-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        <!-- Body -->
        <div id="receipt-content" class="event-body">
          <!-- Booking Reference -->
          <div class="section-reference">
            <label>Booking Reference</label>
            <div class="txn-id">{{ orderService.orderData()?.txn_id }}</div>
            <div class="txn-date">{{ (orderService.orderData()?.addedOn * 1000) | date:"MMMM d, yyyy, h:mm a" }}</div>
          </div>

          <hr class="divider" />

          <!-- Event Info Titles -->
          <div class="event-titles">
            <h2>{{ getEventItem()?.firstName }} {{ getEventItem()?.lastName }}</h2>
            <p>{{ getEventItem()?.itemName }}</p>
          </div>

          <!-- Info Cards Grid -->
          <div class="info-grid">
            <div class="info-card card-pink">
              <div class="card-icon">📅</div>
              <label>Date</label>
              <div class="value">{{ getEventItem()?.eventDate || 'Friday, 20 February 2026' }}</div>
            </div>
            <div class="info-card card-green">
              <div class="card-icon">📍</div>
              <label>Location</label>
              <div class="value">{{ getEventItem()?.city || 'dfgdg' }}</div>
            </div>
            <div class="info-card card-pink">
              <div class="card-icon">⏰</div>
              <label>Start Time</label>
              <div class="value">{{ getEventItem()?.eventStartTime || '01:47' }}</div>
            </div>
            <div class="info-card card-green">
              <div class="card-icon">👥</div>
              <label>Tickets</label>
              <div class="value">{{ orderService.totalAmount() | currency }} Persons</div>
            </div>
          </div>

          <hr class="divider" />

          <!-- Booking Details -->
          <div class="details-section">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <label>Name</label>
              <span>{{ getEventItem()?.firstName }} {{ getEventItem()?.lastName }}</span>
            </div>
            <div class="detail-row">
              <label>Email</label>
              <span>{{ getEventItem()?.email || 'st83210@gmail.com' }}</span>
            </div>
            <div class="detail-row">
              <label>Mobile</label>
              <span>{{ getEventItem()?.mobile || '8294483221' }}</span>
            </div>
            <div class="detail-row" *ngIf="getEventItem()?.city">
              <label>Pickup Location</label>
              <span>{{ getEventItem()?.city }}</span>
            </div>
          </div>

          <hr class="divider" />

          <!-- Payment Summary -->
          <div class="details-section">
            <h3>Payment Summary</h3>
            <div class="detail-row">
              <label>Tickets (1 × {{ getEventItem()?.itemPrice || getEventItem()?.amount | currency }})</label>
              <span>{{ getEventItem()?.itemPrice || getEventItem()?.amount | currency }}</span>
            </div>
            <div class="detail-row">
              <label>Fees</label>
              <span>{{ orderService.orderData()?.plateformFees | currency }}</span>
            </div>
            <div class="detail-row font-bold text-black border-t pt-2 mt-2">
              <label>Total Paid</label>
              <span>{{ orderService.totalAmount() | currency }}</span>
            </div>
          </div>

          <div class="footer-messages">
            <p>A confirmation email has been sent to</p>
            <p class="font-semibold">{{ getEventItem()?.email || 'st83210@gmail.com' }}</p>
            <p class="mt-4">Please take screenshot and save this and booking reference for the event</p>
            <p class="text-pink-500 font-bold mt-6 italic">✔ We look forward to seeing you!</p>
          </div>
        </div>

        <!-- Fixed Bottom Action -->
        <div class="fixed-bottom">
          <button (click)="onReturn()" class="book-another-btn">
            Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-layout {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }
    
    .success-container { width: 100%; display: flex; align-items: center; justify-content: center; padding: 60px 20px; z-index: 1000; overflow-y: auto; position: relative; }
    .max-w-lg { max-width: 32rem; }
    .pt-4 { padding-top: 1rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .u-rounded-lg { border-radius: 0.5rem; }
    .u-rounded-full { border-radius: 9999px; }
    .border-t { border-top: 1px solid; }
    .border-border-50 { border-color: rgba(255, 255, 255, 0.05); }
    .border-border-30 { border-color: rgba(255, 255, 255, 0.03); }
    .w-2 { width: 0.5rem; } .h-2 { height: 0.5rem; }
    .w-4 { width: 1rem; } .h-4 { height: 1rem; }
    .w-5 { width: 1.25rem; } .h-5 { height: 1.25rem; }
    .w-10 { width: 2.5rem; } .h-10 { height: 2.5rem; }
    .w-12 { width: 3rem; } .h-12 { height: 3rem; }
    .w-24 { width: 6rem; } .h-24 { height: 6rem; }
    .bg-primary { background-color: #10b981; }
    .bg-primary-glow { background-color: rgba(16, 185, 129, 0.3); }
    .bg-secondary-50 { background: rgba(30, 41, 59, 0.5); }
    .from-primary { --tw-gradient-from: #10b981; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(16, 185, 129, 0)); }
    .to-accent { --tw-gradient-to: #14b8a6; }
    .from-primary-20 { --tw-gradient-from: rgba(16, 185, 129, 0.2); }
    .to-accent-20 { --tw-gradient-to: rgba(20, 184, 166, 0.2); }
    .u-bg-secondary-30 { background: rgba(30, 41, 59, 0.3); }
    .u-bg-primary-10 { background: rgba(16, 185, 129, 0.1); }
    .u-text-primary { color: #10b981; }
    .u-bg-primary-glow { background-color: rgba(16, 185, 129, 0.15); }
    .u-text-xs { font-size: 0.7rem; }
    .u-bg-black-20 { background: rgba(0, 0, 0, 0.2); }
    .to-emerald-400 { --tw-gradient-to: #34d399; }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .text-foreground { color: #ffffff; }
    .text-primary { color: #10b981; }
    .text-primary-foreground { color: #000000; }
    .text-muted-foreground { color: rgba(255, 255, 255, 0.6); }
    .text-muted-fg-60 { color: rgba(255, 255, 255, 0.4); }
    .status-primary { color: #10b981; }
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .font-medium { font-weight: 500; }
    .font-mono { font-family: monospace; }
    .text-gradient-gold { background: linear-gradient(to right, #fbbf24, #d97706); -webkit-background-clip: text; color: transparent; }
    .blur-xl { filter: blur(24px); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .shadow-primary-25 { box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3); }
    .transition-all { transition: all 0.3s ease; }
    .duration-300 { transition-duration: 300ms; }
    .overflow-hidden { overflow: hidden; }
    .u-text-right { text-align: right; }
    .hover-bg-secondary:hover { background: rgba(51, 65, 85, 0.8); }
    .hover-text-primary:hover { color: #10b981; }
    .hover-shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    .hover-shadow-primary-30:hover { box-shadow: 0 15px 30px -10px rgba(16, 185, 129, 0.5); }
    .anim-fade-in { animation: gFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-pulse-glow { animation: gPulseGlow 3s ease-in-out infinite; }
    .animate-pulse { animation: gPulse 2s infinite; }
    .shine-effect { position: absolute; inset: 0; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent); transform: translateX(-100%); animation: shine 3s infinite; }
    @keyframes shine { 100% { transform: translateX(100%); } }
    .action-btn { transition: all 0.2s ease; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.05); }
    .action-btn:hover { transform: translateY(-2px); }
    .return-btn { transition: transform 0.3s ease, box-shadow 0.3s ease; border: none; }
    .return-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 20px rgba(16, 185, 129, 0.5); }

    /* EVENT MODE STYLES */
    .success-layout.event-mode {
      background: #f8fafc;
      justify-content: flex-start;
      padding-bottom: 80px; /* Space for fixed button */
    }

    .event-success-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: white;
      min-height: 100vh;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .event-header {
      background: #4CAF50;
      color: white;
      padding: 40px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .header-check {
      width: 64px;
      height: 64px;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .header-check svg {
      width: 32px;
      height: 32px;
    }

    .event-header h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }

    .event-header p {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }

    .event-body {
      padding: 30px 24px;
      background: white;
    }

    .section-reference {
      text-align: center;
      margin-bottom: 20px;
    }

    .section-reference label {
      display: block;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .txn-id {
      font-size: 24px;
      font-weight: 700;
      color: #f43f5e; /* Pink-ish as in screenshot */
      margin-bottom: 4px;
    }

    .txn-date {
      font-size: 13px;
      color: #64748b;
    }

    .divider {
      border: 0;
      border-top: 1px solid #f1f5f9;
      margin: 24px 0;
    }

    .event-titles {
      text-align: center;
      margin-bottom: 24px;
    }

    .event-titles h2 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .event-titles p {
      font-size: 16px;
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }

    .info-card {
      padding: 16px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .card-pink { background: #fff1f2; }
    .card-green { background: #f0fdf4; }

    .card-icon {
      font-size: 20px;
      margin-bottom: 8px;
    }

    .info-card label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .info-card .value {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }

    .details-section h3 {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 13px;
    }

    .detail-row label {
      color: #64748b;
    }

    .detail-row span {
      color: #1e293b;
      font-weight: 600;
      text-align: right;
    }

    .footer-messages {
      text-align: center;
      margin-top: 40px;
      font-size: 13px;
      color: #475569;
    }

    .footer-messages .font-semibold {
      color: #1e293b;
    }

    .text-pink-500 { color: #ec4899; }

    .fixed-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 16px 20px;
      box-shadow: 0 -4px 10px rgba(0,0,0,0.05);
      z-index: 100;
      display: flex;
      justify-content: center;
    }

    .book-another-btn {
      width: 100%;
      max-width: 800px;
      background: #000;
      color: white;
      border: none;
      padding: 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
    }

    .text-black { color: #000 !important; }
    .font-bold { font-weight: 700 !important; }
  `]
})
export class SuccessPageComponent implements OnInit, OnDestroy {
  orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  countdown = signal(600);
  isMerchantImageValid = signal(true);
  private timer: any;

  handleMerchantImageError() {
    this.isMerchantImageValid.set(false);
  }

  isEvent(): boolean {
    return this.orderService.orderData()?.payment_sub_type === 'event';
  }

  getEventItem() {
    const list = this.orderService.orderData()?.menuList;
    return (list && list.length > 0) ? list[0] : null;
  }


  ngOnInit() {
    this.orderService.isLoading.set(true);
    this.orderService.isError.set(false);
    this.orderService.loadingMessage.set('Confirming your payment and generating receipt...');
    this.route.queryParams.subscribe(params => {
      let token = params['token'] || '';
      if (!token) {
        const keys = Object.keys(params);
        const tokenKey = keys.find(k => k.includes(':') && k.length > 30);
        if (tokenKey) {
          token = tokenKey;
          if (params[tokenKey] && params[tokenKey] !== '') {
            token += '=' + params[tokenKey];
          }
        }
      }

      let orderID = params['orderId'] || '';
      let paymentId = params['paymentId'] || '';

      if (token) {
        const decrypted = this.decryptToken(token);
        if (decrypted) {
          orderID = decrypted.orderId;
          paymentId = decrypted.paymentId;
        }
      }

      if (orderID) {
        this.orderService.getOrderItems(orderID, !!paymentId).subscribe({
          next: (res) => {
            this.startCountdown();
            this.orderService.isLoading.set(false);
          },
          error: (err) => {
            console.error("Error fetching order items:", err);
            this.orderService.isLoading.set(false);
            this.orderService.isError.set(true);
          }
        });
      } else {
        this.orderService.isLoading.set(false);
        this.orderService.isError.set(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private decryptToken(token: string): any {
    try {
      const parts = token.split(":");
      if (parts.length < 2) return null;
      const ivPart = parts[0];
      let encPart = parts[1];
      if (encPart.endsWith("=")) encPart = encPart.slice(0, -1);

      const key = CryptoJS.SHA256(environment.encryptionKey);
      const iv = CryptoJS.enc.Hex.parse(ivPart);
      const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(encPart) });
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      const decStr = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decStr) return null;

      const params = new URLSearchParams(decStr);
      return {
        merId: params.get('merId') || '',
        orderId: params.get('orderId') || '',
        paymentId: params.get('paymentId') || ''
      };
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }

  private startCountdown() {
    const url = this.orderService.orderData()?.url;
    if (!url || url.trim() === '') {
      console.log("No redirect URL found, staying on success page.");
      return;
    }

    this.timer = setInterval(() => {
      this.countdown.update(v => v - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.timer);
        this.onReturn();
      }
    }, 1000);
  }

  onReturn() {
    const url = this.orderService.orderData()?.url;
    if (url && url.trim() !== '') {
      window.location.href = url;
    }
  }

  getPaymentIcon(): string {
    const mode = (this.orderService.orderData()?.paymentMode || '').toLowerCase();

    if (mode.startsWith('pay')) return 'payto-logo.png';
    if (mode.includes('card')) return 'mastercard.svg';
    if (mode.includes('apple')) return 'apple-pay.svg';
    if (mode.includes('google')) return 'google-pay.svg';
    if (mode.includes('klarna')) return 'klarna.svg';
    if (mode.includes('afterpay')) return 'afterpay.svg';
    if (mode.includes('bank')) return 'bank.svg';
    if (mode.includes('upi')) return 'upi.svg';
    if (mode.includes('link')) return 'link-stripe.svg';

    return '';
  }

  isZipPay(): boolean {
    const mode = (this.orderService.orderData()?.paymentMode || '').toLowerCase();
    return mode.includes('zip');
  }

  async downloadReceipt() {
    const node = document.getElementById('receipt-content');
    if (!node) return;

    // Small delay to ensure any dynamic styles or images are fully painted
    await new Promise(resolve => setTimeout(resolve, 300));

    const options = {
      backgroundColor: '#020617',
      cacheBust: true,
      skipFonts: true,
      pixelRatio: 2, // High quality
      style: {
        borderRadius: '24px',
        padding: '20px'
      }
    };

    try {
      const dataUrl = await toPng(node, options);
      const link = document.createElement('a');
      link.download = `Receipt-${this.orderService.orderData()?.txn_id || 'KuberPay'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('High-quality capture failed, trying fallback...', error);
      try {
        const dataUrl = await toPng(node, { ...options, filter: (n: any) => n.tagName !== 'IMG' });
        const link = document.createElement('a');
        link.download = `Receipt-${this.orderService.orderData()?.txn_id || 'KuberPay'}-Simple.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Fallback failed', err);
      }
    }
  }

  async shareReceipt() {
    const node = document.getElementById('receipt-content');
    if (!node) return;

    await new Promise(resolve => setTimeout(resolve, 300));

    const options = {
      backgroundColor: '#020617',
      cacheBust: true,
      skipFonts: true,
      pixelRatio: 2
    };

    try {
      const blob = await toBlob(node, options);
      if (!blob) return;
      await this.performShare(blob);
    } catch (error) {
      console.error('High-quality share failed, trying fallback...', error);
      try {
        const blob = await toBlob(node, { ...options, filter: (n: any) => n.tagName !== 'IMG' });
        if (blob) await this.performShare(blob);
      } catch (err) {
        console.error('Fallback share failed', err);
      }
    }
  }

  private async performShare(blob: Blob) {
    const filename = `Receipt-${this.orderService.orderData()?.txn_id || 'KuberPay'}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Payment Receipt',
          text: 'My payment receipt from KuberPay',
        });
      } catch (e) {
        console.error('Share rejected', e);
        this.downloadReceipt();
      }
    } else {
      this.downloadReceipt();
    }
  }
}
