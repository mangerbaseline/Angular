import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

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
              <div class="item-desc">{{ item.desc }}</div>
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
  styles: [`
    .loading-state {
      padding: 1rem;
    }
    .skeleton {
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
    .free {
      color: #10b981;
      font-weight: 600;
    }
  `]
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

  ngOnInit() {
    this.fetchOrderDetails();
  }

  fetchOrderDetails() {
    this.loading.set(true);
    // Static orderID as requested
    const orderID = "69d8c39a8465304915452e1d";

    this.orderService.getOrderItems(orderID).subscribe({
      next: (response) => {
        console.log('Order Items:', response);
        if (response && response.data) {
          const orderData = response.data;

          // Map menuList to items
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

          this.subtotal.set(orderData.prevAmt || 0);
          this.tax.set(parseFloat(orderData.gstAmount || orderData.GSTAmt || 0));
          this.fees.set(orderData.plateformFees || 0);
          this.discount.set(orderData.discount || 0);
          this.gstEnabled.set(!!orderData.gstEnabled);
          
          // Calculate total: subtotal + platformFees - discount + (gst if enabled)
          const calculatedTotal = this.subtotal() + this.fees() - this.discount() + (this.gstEnabled() ? this.tax() : 0);
          this.total.set(calculatedTotal);

          // If we want to show platform fees, we might need another line in the UI
          // For now, let's keep it simple or include platform fees in the subtotal/tax if needed
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching order items:', error);
        this.loading.set(false);
      }
    });
  }


  toggleExpand() {
    this.isExpanded.set(!this.isExpanded());
  }
}
