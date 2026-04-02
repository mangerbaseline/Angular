import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="brand-header">
      <div class="header-main-row">
        <!-- Logo + Brand -->
        <div class="logo-row">
          <div class="brand-logo-circle">
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#10b981"/>
            </svg>
          </div>
          <span class="brand-name"><strong>Kuber</strong>Pay</span>
        </div>

        <!-- Mobile-only Price -->
        <div class="mobile-price">
          <div class="m-price-label">Amount</div>
          <div class="m-price-value">$789.60</div>
        </div>
      </div>

      <!-- Merchant info row -->
      <div class="merchant-row">
        <div class="merchant-visual">
          <div class="merchant-logo-main">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24" color="#10b981"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <div class="merchant-badge-overlay">
              <svg viewBox="0 0 24 24" fill="white" width="10" height="10"><path d="M12 22l8-4V5l-8-3-8 3v7l8 4z"/><path d="M9 12l2 2 4-4" stroke="#10b981" stroke-width="2"/></svg>
            </div>
          </div>
          <div class="merchant-details">
            <div class="paying-to">
              Paying to <span class="verified-tag">
                <svg viewBox="0 0 24 24" width="10" fill="currentColor" style="margin-right:2px"><path d="M12 22l8-4V5l-8-3-8 3v7l8 4z"/><path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/></svg>
                Verified</span>
            </div>
            <div class="merchant-name-row">
              <span class="merchant-name">TechStore Pro</span>
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14" class="ext-icon" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-header {
      position: absolute;
      top: 24px;
      left: 24px;
      right: 24px; /* Ensure it spans full width */
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 100;
    }

    .header-main-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mobile-price {
      text-align: right;
      display: block;
    }

    .m-price-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.1em;
      margin-bottom: -2px;
    }

    .m-price-value {
      font-size: 22px;
      font-weight: 800;
      color: #10b981;
    }

    @media (min-width: 860px) {
      .mobile-price {
        display: none;
      }
    }

    .logo-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-name {
      font-size: 20px;
      color: #f1f5f9;
      font-weight: 400;
      letter-spacing: -0.5px;
    }

    .brand-name strong {
      font-weight: 800;
      color: #f1f5f9;
    }

    .merchant-row {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .paying-label {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: #475569;
      font-weight: 500;
    }

    .verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 100px;
      padding: 1px 6px;
    }

    .brand-logo-circle {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #fcd34d, #10b981);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
    }

    .m-price-label {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      margin-bottom: -4px;
    }

    .merchant-visual {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }

    .merchant-logo-main {
      width: 48px;
      height: 48px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .merchant-badge-overlay {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 18px;
      height: 18px;
      background: #10b981;
      border: 2px solid #020617;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .paying-to {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 2px;
    }

    .verified-tag {
      color: #10b981;
      font-weight: 700;
      display: flex;
      align-items: center;
    }

    .merchant-name-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .merchant-name {
      font-size: 16px;
      font-weight: 700;
      color: #f1f5f9;
    }

    @media (max-width: 860px) {
      .brand-header {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        padding: 24px 24px 8px; 
        background: transparent;
        gap: 16px;
      }
    }

    .ext-icon {
      opacity: 0.4;
      cursor: pointer;
    }

    .ext-icon:hover { opacity: 0.7; }
  `]
})
export class BrandHeaderComponent { }
