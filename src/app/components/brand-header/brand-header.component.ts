import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="brand-header">
      <!-- Top row: Logo + Brand name -->
      <div class="logo-row">
        <div class="logo-icon">
          <svg viewBox="0 0 28 28" fill="none" width="24" height="24">
            <rect width="28" height="28" rx="8" fill="rgba(16,185,129,0.15)"/>
            <path d="M14 5l2.79 5.65 6.24.91-4.51 4.4 1.06 6.2L14 19.08l-5.58 2.93 1.06-6.2L5 11.56l6.24-.91L14 5z" fill="#10b981" stroke="#10b981" stroke-width="0.5"/>
          </svg>
        </div>
        <span class="brand-name"><strong>Kuber</strong>Pay</span>
      </div>
      <!-- Merchant info row -->
      <div class="merchant-row">
        <div class="paying-label">
          Paying to &nbsp;
          <span class="verified-badge">
            <svg viewBox="0 0 16 16" fill="#10b981" width="9" height="9"><path d="M8 1.333l5.333 2v5.334c0 3.083-2.5 5.916-5.333 7-2.833-1.084-5.333-3.917-5.333-7V3.333L8 1.333z"/></svg>
            Verified
          </span>
        </div>
        <div class="merchant-info">
          <div class="merchant-logo">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <rect width="24" height="24" rx="6" fill="rgba(16,185,129,0.15)"/>
              <path d="M12 5l1.5 3.5 3.5.5-2.5 2.5.5 3.5L12 13.5l-3 1.5.5-3.5L7 9l3.5-.5L12 5z" fill="#10b981"/>
            </svg>
          </div>
          <span class="merchant-name">TechStore Pro</span>
          <svg viewBox="0 0 20 20" fill="none" width="14" height="14" class="ext-icon">
            <path d="M11 3H17V9M17 3L9 11M5 7H3V17H13V15" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-header {
      position: absolute;
      top: 24px;
      left: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 100;
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

    .merchant-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .merchant-logo {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .merchant-name {
      font-size: 15px;
      font-weight: 700;
      color: #f1f5f9;
    }

    .ext-icon {
      opacity: 0.4;
      cursor: pointer;
    }

    .ext-icon:hover { opacity: 0.7; }
  `]
})
export class BrandHeaderComponent {}
