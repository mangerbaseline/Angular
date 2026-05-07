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
                    <div *ngIf="item.firstName || item.lastName || item.itemName">
                      <h3 class="u-font-semibold text-foreground">
                        {{ item.firstName }} {{ item.lastName }}
                        <span *ngIf="!item.firstName && !item.lastName">{{ item.itemName }}</span>
                      </h3>
                      <p class="text-[11px] text-muted-foreground" *ngIf="item.itemName && (item.firstName || item.lastName)">{{ item.itemName }}</p>
                      <p class="text-[10px] text-muted-fg-60 mt-1" *ngIf="item.description">{{ item.description }}</p>
                    </div>
                    <img *ngIf="item.image && (item.image.startsWith('http') || item.image.startsWith('https'))" 
                         [src]="item.image" 
                         crossOrigin="anonymous"
                         style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);">
                  </div>
                  <div class="u-grid u-grid-cols-1 u-gap-2 text-[11px]">
                    <div class="u-flex u-justify-between u-items-center border-t border-border-30 pt-2" *ngIf="item.quantity || item.perItemPrice || item.amount">
                      <span class="text-muted-foreground">Quantity: {{ item.quantity || 1 }}</span>
                      <span class="u-font-semibold text-foreground">{{ (item.perItemPrice || item.amount) | currency }}</span>
                    </div>
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

            <!-- Detailed Invoice Section (for Invoices) -->
            <div *ngIf="orderService.orderData()?.addedby === 'invoice'" class="border-t border-border-50 pt-6">
              <h1 class="u-text-center u-text-xl u-font-bold text-foreground mb-8 uppercase tracking-[0.2em]" style="font-family: 'Space Grotesk', sans-serif;">Invoice</h1>
              
              <div class="u-flex u-justify-between u-items-start mb-6">
                <div class="u-space-y-1">
                  <p class="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">To</p>
                  <p class="text-sm font-semibold text-foreground">{{ orderService.orderData()?.invoiceDetails?.invoiceTitle || 'Customer' }}</p>
                </div>
                <div class="u-text-right u-space-y-1">
                  <p class="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">Invoice No.</p>
                  <p class="text-sm font-semibold text-foreground">{{ orderService.orderData()?.invoiceDetails?.invoiceNo || orderService.orderData()?.txn_id }}</p>
                </div>
              </div>

              <div class="u-flex u-justify-between u-items-start mb-8">
                <div class="u-space-y-1">
                  <p class="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">Issued On</p>
                  <p class="text-sm font-semibold text-foreground">{{ (orderService.orderData()?.addedOn * 1000) | date:'dd-MM-yyyy' }}</p>
                </div>
                <div class="u-text-right u-space-y-1">
                  <p class="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">From</p>
                  <p class="text-sm font-semibold text-foreground">
                    {{ orderService.orderData()?.merchantData?.email || orderService.orderData()?.merchantData?.name }}
                  </p>
                </div>
              </div>

              <!-- Itemized Table Header -->
          <div class="u-grid u-grid-cols-12 u-gap-2 u-pb-2 border-b border-border-30 mb-4 text-[6px] font-bold text-muted-foreground uppercase tracking-widest">
  <div class="u-col-span-6">Item</div>
  <div class="u-col-span-2 u-text-center">Qty.</div>
  <div class="u-col-span-2 u-text-right">Rate</div>
  <div class="u-col-span-2 u-text-right">Amount</div>
</div>

              <!-- Items -->
              <div class="u-space-y-4 mb-8">
                <div *ngFor="let item of orderService.orderData()?.menuList" class="u-grid u-grid-cols-12 u-gap-2 text-sm">
                  <div class="u-col-span-6 u-font-bold text-foreground">{{ item.itemName }}</div>
                  <div class="u-col-span-2 u-text-center text-muted-foreground">{{ item.quantity | number:'2.0-0' }}</div>
                  <div class="u-col-span-2 u-text-right text-muted-foreground">{{ (item.itemPrice || item.perItemPrice) | number:'1.2-2' }}</div>
                  <div class="u-col-span-2 u-text-right u-font-semibold text-foreground">{{ (item.totalPrice || item.amount) | number:'1.2-2' }}</div>
                </div>
              </div>

              <!-- Footer Calculations (Matches sidebar logic) -->
              <div class="border-t border-border-50 pt-4 u-space-y-3">
                <div class="u-flex u-justify-between text-sm">
                  <span class="text-foreground font-medium">Subtotal</span>
                  <span class="text-foreground u-font-medium">{{ getRawSubtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="u-flex u-justify-between text-sm" *ngIf="(orderService.orderData()?.discount || 0) > 0">
                  <span class="text-pink-500 font-medium">Discount</span>
                  <span class="text-pink-500">-{{ (orderService.orderData()?.discount || 0) | number:'1.2-2' }}</span>
                </div>
                <div class="u-flex u-justify-between text-sm" *ngIf="orderService.orderData()?.gstEnabled">
                  <span class="text-foreground font-medium">Total Tax (GST)</span>
                  <span class="text-foreground u-font-medium">{{ (orderService.orderData()?.GSTAmt || orderService.orderData()?.gstAmount || 0) | number:'1.2-2' }}</span>
                </div>
                <div class="u-flex u-justify-between text-sm" *ngIf="(orderService.orderData()?.plateformFees || 0) > 0">
                  <span class="text-foreground font-medium">Platform Fees</span>
                  <span class="text-foreground u-font-medium">{{ (orderService.orderData()?.plateformFees || 0) | number:'1.2-2' }}</span>
                </div>
                <div class="u-flex u-justify-between u-items-center pt-3 border-t border-border-30">
                  <span class="u-text-lg u-font-bold text-foreground">Total Amount</span>
                  <span class="u-text-2xl u-font-extrabold u-text-gradient">
                    {{ (getRawSubtotal() - (orderService.orderData()?.discount || 0) + (orderService.orderData()?.gstEnabled ? (orderService.orderData()?.GSTAmt || orderService.orderData()?.gstAmount || 0) : 0) + (orderService.orderData()?.plateformFees || 0)) | currency }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Standard Summary (for non-invoices) -->
            <div *ngIf="orderService.orderData()?.addedby !== 'invoice'" class="border-t border-border-50 pt-4">
              <h2 class="text-sm font-medium text-muted-foreground mb-5" style="font-family: 'Space Grotesk', sans-serif;">Order Summary</h2>
              <div class="u-space-y-4 text-sm pt-4 border-t border-border-30">
                <div class="u-flex u-justify-between u-font-semibold pt-2">
                  <span class="text-foreground">Total Paid</span>
                  <span class="u-text-gradient">{{ orderService.totalAmount() | currency }}</span>
                </div>
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
            <h2>{{ getEventItem()?.firstName || orderService.orderData()?.qrTableData?.name }} {{ getEventItem()?.lastName || '' }}</h2>
            <p>{{ getEventItem()?.itemName || ticketData()?.bannerHeading || 'Event Booking' }}</p>
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
              <div class="value">{{ ticketData()?.location || getEventItem()?.city || 'N/A' }}</div>
            </div>
            <div class="info-card card-pink">
              <div class="card-icon">⏰</div>
              <label>Start Time</label>
              <div class="value">{{ ticketData()?.pickup || getEventItem()?.eventStartTime || 'N/A' }}</div>
            </div>
            <div class="info-card card-green">
              <div class="card-icon">👥</div>
              <label>Tickets</label>
              <div class="value">{{ getQuantity() }} Persons</div>
            </div>
          </div>

          <hr class="divider" />

          <!-- Booking Details -->
          <div class="details-section">
            <h3>Booking Details</h3>
            <div class="detail-row" *ngIf="getEventItem()?.firstName || orderService.orderData()?.qrTableData?.name">
              <label>Name</label>
              <span>{{ getEventItem()?.firstName || orderService.orderData()?.qrTableData?.name }} {{ getEventItem()?.lastName || '' }}</span>
            </div>
            <div class="detail-row" *ngIf="getEventItem()?.email || orderService.orderData()?.qrTableData?.email">
              <label>Email</label>
              <span>{{ getEventItem()?.email || orderService.orderData()?.qrTableData?.email }}</span>
            </div>
            <div class="detail-row" *ngIf="getEventItem()?.mobile || orderService.orderData()?.qrTableData?.phone">
              <label>Mobile</label>
              <span>{{ getEventItem()?.mobile || orderService.orderData()?.qrTableData?.phone }}</span>
            </div>
            <div class="detail-row" *ngIf="getEventItem()?.city || ticketData()?.location">
              <label>Pickup Location</label>
              <span>{{ ticketData()?.location || getEventItem()?.city }}</span>
            </div>
          </div>

          <hr class="divider" />

          <!-- Payment Summary -->
          <div class="details-section">
            <h3>Payment Summary</h3>
            <div class="detail-row">
              <label>Tickets ({{ getQuantity() }} × {{ (ticketData()?.perPerson || getEventItem()?.perItemPrice || getEventItem()?.amount) | currency }})</label>
              <span>{{ ( getQuantity() * (ticketData()?.perPerson || getEventItem()?.perItemPrice || getEventItem()?.amount) ) | currency }}</span>
            </div>
            <div class="detail-row" *ngIf="orderService.orderData()?.plateformFees">
              <label>Fees</label>
              <span>{{ orderService.orderData()?.plateformFees | currency }}</span>
            </div>
            <div class="detail-row font-bold text-black border-t pt-2 mt-2">
              <label>Total Paid</label>
              <span>{{ orderService.totalAmount() | currency }}</span>
            </div>
          </div>

          <div class="footer-messages">
            <p *ngIf="getEventItem()?.email || orderService.orderData()?.qrTableData?.email">A confirmation email has been sent to</p>
            <p class="font-semibold" *ngIf="getEventItem()?.email || orderService.orderData()?.qrTableData?.email">
              {{ getEventItem()?.email || orderService.orderData()?.qrTableData?.email }}
            </p>
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
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit, OnDestroy {
  orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  countdown = signal(600);
  isMerchantImageValid = signal(true);
  ticketData = signal<any>(null);
  private timer: any;

  getRawSubtotal(): number {
    const list = this.orderService.orderData()?.menuList || [];
    return list.reduce((acc: number, item: any) => acc + (parseFloat(item.totalPrice || item.amount || 0) || 0), 0);
  }

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

  getQuantity(): number {
    const data = this.orderService.orderData();
    if (!data) return 1;

    // Check menuList first
    if (data.menuList && data.menuList.length > 0) {
      return data.menuList[0].quantity || 1;
    }

    // Fallback to qrTableData
    if (data.qrTableData && data.qrTableData.quantity) {
      return data.qrTableData.quantity;
    }

    return 1;
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

            // If event booking, fetch additional ticket details
            if (this.isEvent()) {
              const merchantId = res.data?.merchantID || res.data?.userID;
              if (merchantId) {
                this.orderService.getTicketByMerchantId(merchantId).subscribe({
                  next: (ticketRes) => {
                    if (ticketRes && ticketRes.success) {
                      this.ticketData.set(ticketRes.response);
                    }
                  }
                });
              }
            }
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
    if (this.isEvent()) {
      const merchantId = this.orderService.orderData()?.merchantID || this.orderService.orderData()?.userID;
      if (merchantId) {
        window.location.href = `https://backend.kuberfinancial.com.au/tableQR?merId=${merchantId}&spl=true&event=true`;
        return;
      }
    }

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
