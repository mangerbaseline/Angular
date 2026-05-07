import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-summary glass" [class.expanded]="isExpanded()">
      <div class="summary-header" (click)="toggleExpand()">
        <div class="info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
          <div class="text">
            <div class="title">Order Summary</div>
            <div class="item-count" *ngIf="items().length > 0">{{ items().length }} items</div>
          </div>
        </div>
        <div class="price-info">
          <div class="total">{{ total() | currency }}</div>
          <svg class="chevron" [class.rotated]="isExpanded()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <div class="summary-body">
        <div class="items-list">
          <div *ngIf="loading()" class="loading-state">
            <div class="skeleton" style="height: 60px; margin-bottom: 12px; border-radius: 12px;"></div>
            <div class="skeleton" style="height: 60px; margin-bottom: 12px; border-radius: 12px;"></div>
          </div>
          <div *ngFor="let item of items()" class="item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
              </svg>
            </div>
            <div class="item-details">
              <div class="item-top">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">{{ item.price | currency }}</span>
              </div>
              <div class="item-desc" *ngIf="item.desc">{{ item.desc }}</div>
              <div class="item-qty">Qty: {{ item.qty }}</div>
            </div>
          </div>
        </div>

        <div class="breakdown">
          <div class="line">
            <span>Subtotal</span>
            <span>{{ subtotal() | currency }}</span>
          </div>
          <div class="line">
            <span>Shipping</span>
            <span class="free">FREE</span>
          </div>
          <div class="line" *ngIf="gstEnabled()">
            <span>Tax (GST)</span>
            <span>{{ tax() | currency }}</span>
          </div>
          <div class="line">
            <span>Platform Fees</span>
            <span>{{ fees() | currency }}</span>
          </div>
          <div class="line discount" *ngIf="discount() > 0">
            <span>Discount Applied</span>
            <span>-{{ discount() | currency }}</span>
          </div>
          
          <div class="promo-code">
            <input type="text" placeholder="Promo code">
            <button>Apply</button>
          </div>

          <div class="final-total">
            <div class="total-label">
              <span>Total</span>
              <span class="gst-label" *ngIf="gstEnabled()">Including GST</span>
            </div>
            <div class="total-value">{{ total() | currency }}</div>
          </div>
        </div>
        
        <div class="footer-badges">
           <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Secure checkout</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  private orderService = inject(OrderService);

  isExpanded = signal(true);
  loading = signal(true);
  items = signal<any[]>([]);

  subtotal = signal(0);
  tax = signal(0);
  fees = signal(0);
  discount = signal(0);
  total = signal(0);
  gstEnabled = signal(false);

  private route = inject(ActivatedRoute);

  decryptToken(token: string): any {
    try {
      const parts = token.split(":");
      if (parts.length < 2) return null;
      const ivPart = parts[0];
      let encPart = parts[1];
      if (encPart.endsWith("=")) {
        encPart = encPart.slice(0, -1);
      }

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

  ngOnInit() {
    this.fetchOrderDetails();
  }

  fetchOrderDetails() {
    this.loading.set(true);

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

      if (!orderID) {
        this.loading.set(false);
        this.orderService.isError.set(true);
        return;
      }

      this.orderService.getOrderItems(orderID, !!paymentId).subscribe({
        next: (response) => {
          console.log('Order Items:', response);
          if (response && response.data) {
            const orderData = response.data;

            if (Array.isArray(orderData.menuList)) {
              const filteredList = orderData.menuList.filter((item: any) => {
                const price = item.itemPrice || item.perItemPrice || item.amount || 0;
                return price > 0;
              });

              this.items.set(filteredList.map((item: any) => ({
                name: item.itemName || 'Unknown Item',
                price: item.itemPrice || item.perItemPrice || item.amount || 0,
                desc: item.description || '',
                qty: item.quantity || 1
              })));
            }

            // In this API structure:
            // prevAmt seems to be the raw subtotal (sum of item prices)
            // discount is the discount amount
            // GSTAmt is the tax
            // plateformFees is an additional fee
            // amount is the total to be paid

            const itemsSum = (orderData.menuList || []).reduce((acc: number, item: any) => acc + (parseFloat(item.totalPrice || item.amount || 0) || 0), 0);
            this.subtotal.set(itemsSum || orderData.prevAmt || 0);
            
            this.tax.set(parseFloat(orderData.gstAmount || orderData.GSTAmt || 0));
            this.fees.set(orderData.plateformFees || 0);
            this.discount.set(orderData.discount || 0);
            this.gstEnabled.set(!!orderData.gstEnabled);

            const calculatedTotal = this.subtotal() - this.discount() + (this.gstEnabled() ? this.tax() : 0) + this.fees();
            this.total.set(calculatedTotal);

            // If we want to show platform fees, we might need another line in the UI
            // For now, let's keep it simple or include platform fees in the subtotal/tax if needed
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error fetching order items:', error);
          this.loading.set(false);
          this.orderService.isError.set(true);
        }
      });
    });
  }


  toggleExpand() {
    this.isExpanded.set(!this.isExpanded());
  }
}
