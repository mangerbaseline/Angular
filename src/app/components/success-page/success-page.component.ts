import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container anim-fade-in">
      <div class="u-glass u-rounded-3xl u-p-8 u-space-y-6 max-w-lg u-w-full">
        <div class="u-flex u-flex-col u-items-center u-text-center">
          <div class="u-relative">
            <div class="u-absolute u-inset-0 rounded-full bg-primary-glow blur-xl anim-pulse-glow" style="transform: scale(1.18699);"></div>
            <div class="u-relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent u-flex u-items-center u-justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-12 h-12 text-primary-foreground"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
            </div>
          </div>
          <div class="u-mt-6">
            <h1 class="u-text-3xl u-font-bold text-foreground mb-2">Payment Successful!</h1>
            <p class="text-muted-foreground">Your payment of <span class="u-text-gradient u-font-semibold">$789.60 AUD</span> has been processed</p>
          </div>
        </div>
        <div class="u-flex u-items-center u-justify-center u-gap-3 u-p-4 u-rounded-xl bg-secondary-50">
          <div class="w-10 h-10 u-rounded-lg bg-gradient-to-br from-primary-20 to-accent-20 u-flex u-items-center u-justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5 text-primary"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
          </div>
          <div class="u-text-left"><p class="text-sm text-muted-foreground">Paid to</p><p class="u-font-semibold text-foreground">TechStore Pro</p></div>
        </div>
        <div class="u-space-y-4">
          <div class="border-t border-border-50 pt-4">
            <h2 class="text-sm font-medium text-muted-foreground mb-3 u-flex u-items-center u-gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt w-4 h-4"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17.5v-11"></path></svg>Transaction Details
            </h2>
            <div class="u-space-y-3 text-sm">
              <div class="u-flex u-justify-between"><span class="text-muted-foreground">Transaction ID</span><button class="u-flex u-items-center u-gap-2 text-foreground font-mono hover-text-primary transition-colors"><span class="text-xs">KP-MNIMAIF1-Z67J</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-3 h-3"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div>
              <div class="u-flex u-justify-between"><span class="text-muted-foreground">Date & Time</span><span class="text-foreground u-text-right text-xs">Friday, 3 April 2026 at 1:33 pm</span></div>
              <div class="u-flex u-justify-between"><span class="text-muted-foreground">Payment Method</span><span class="text-foreground">Apple Pay</span></div>
              <div class="u-flex u-justify-between"><span class="text-muted-foreground">Status</span><span class="status-primary font-medium u-flex u-items-center u-gap-1"><div class="w-2 h-2 u-rounded-full bg-primary animate-pulse"></div>Completed</span></div>
            </div>
          </div>
          <div class="border-t border-border-50 pt-4">
            <h2 class="text-sm font-medium text-muted-foreground mb-3">Order Summary</h2>
            <div class="u-space-y-2 mb-4">
              <div class="u-flex u-justify-between text-sm"><span class="text-foreground">Premium Wireless Headphones × 1</span><span class="text-muted-foreground">$599.00</span></div>
              <div class="u-flex u-justify-between text-sm"><span class="text-foreground">Leather Carrying Case × 1</span><span class="text-muted-foreground">$89.00</span></div>
              <div class="u-flex u-justify-between text-sm"><span class="text-foreground">USB-C Fast Charger × 2</span><span class="text-muted-foreground">$98.00</span></div>
            </div>
            <div class="u-space-y-2 text-sm pt-2 border-t border-border-30">
              <div class="u-flex u-justify-between"><span class="text-muted-foreground">Subtotal</span><span class="text-foreground">$786.00</span></div>
              <div class="u-flex u-justify-between"><span class="text-muted-foreground">Tax (10%)</span><span class="text-foreground">$78.60</span></div>
              <div class="u-flex u-justify-between text-primary"><span>Discount</span><span>-$75.00</span></div>
              <div class="u-flex u-justify-between u-font-semibold pt-2 border-t border-border-30"><span class="text-foreground">Total Paid</span><span class="u-text-gradient">$789.60</span></div>
            </div>
          </div>
        </div>
        <div class="u-space-y-3 pt-2">
          <button (click)="onReturn()" class="return-btn u-relative u-w-full py-4 px-6 u-rounded-2xl u-flex u-items-center u-justify-center u-gap-3 transition-all duration-300 overflow-hidden bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground u-font-semibold shadow-lg shadow-primary-25 hover:shadow-xl hover:shadow-primary-30" tabindex="0"><div class="shine-effect"></div><span class="u-relative u-flex u-items-center u-gap-2">Return to TechStore Pro<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link w-5 h-5"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></span></button>
          <div class="u-grid u-grid-cols-3 u-gap-3">
            <button class="action-btn u-flex u-flex-col u-items-center u-gap-2 u-p-4 u-rounded-2xl bg-secondary-50 hover-bg-secondary transition-colors" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download w-5 h-5 text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg><span class="text-xs text-muted-foreground">Receipt</span></button>
            <button class="action-btn u-flex u-flex-col u-items-center u-gap-2 u-p-4 u-rounded-2xl bg-secondary-50 hover-bg-secondary transition-colors" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-5 h-5 text-primary"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg><span class="text-xs text-muted-foreground">Email</span></button>
            <button class="action-btn u-flex u-flex-col u-items-center u-gap-2 u-p-4 u-rounded-2xl bg-secondary-50 hover-bg-secondary transition-colors" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2 w-5 h-5 text-primary"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg><span class="text-xs text-muted-foreground">Share</span></button>
          </div>
        </div>
        <p class="u-text-center text-xs text-muted-fg-60 pt-4">A confirmation email has been sent to your registered email address.<br>Powered by <span class="text-gradient-gold u-font-semibold">KuberPay</span></p>
      </div>
    </div>
  `,
  styles: [`
    .success-container { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 60px 20px; z-index: 1000; overflow-y: auto; position: relative; }
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
    .to-emerald-400 { --tw-gradient-to: #34d399; }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .text-foreground { color: #ffffff; }
    .text-primary { color: #10b981; }
    .text-primary-foreground { color: #ffffff; }
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
  `]
})
export class SuccessPageComponent {
  @Output() return = new EventEmitter<void>();
  onReturn() { this.return.emit(); }
}
