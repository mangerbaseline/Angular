import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  // Base URLs
  // private wwwApi = 'https://www.kuberfinancial.com.au/api';

  private wwwApi = 'https://backend.kuberfinancial.com.au/api';

  private backendApi = 'https://backend.kuberfinancial.com.au/api';

  // Shared state 
  totalAmount = signal(0);
  orderData = signal<any>(null);

  checkPaymentLinkStatus(paymentId: string): Observable<any> {
    return this.http.post(`${this.backendApi}/paymentlink/checkPaymentLinkStatus`, { paymentId });
  }

  getOrderItems(orderID: string, useBackend: boolean = false): Observable<any> {
    const baseUrl = useBackend ? this.backendApi : this.wwwApi;
    return this.http.post(`${baseUrl}/order/checkout/getItemListNew`, { orderID }).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.orderData.set(response.data);
          if (response.data.finalAmount) {
            this.totalAmount.set(response.data.finalAmount);
          }
        }
      })
    );
  }

  generateToken(merchantID: string, deviceID: string, useBackend: boolean = false): Observable<any> {
    const baseUrl = useBackend ? this.backendApi : this.wwwApi;
    return this.http.post(`${baseUrl}/order/checkout/generateToken`, { merchantID, deviceID });
  }

  getMyPaymentMethod(token: string, deviceId: string, useBackend: boolean = false): Observable<any> {
    const baseUrl = useBackend ? this.backendApi : this.wwwApi;
    const headers = new HttpHeaders({
      'access_token': token,
      'deviceid': deviceId
    });
    return this.http.post(`${baseUrl}/order/checkout/getMyPaymentMethod`, {}, { headers });
  }

  getPaymentStatus(token: string, deviceId: string, orderID: string): Observable<any> {
    const headers = new HttpHeaders({
      'access_token': token,
      'deviceid': deviceId,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.backendApi}/payments/getPaymentStatus`, { orderID }, { headers });
  }

  createPaymentSession(token: string, deviceId: string, orderID: string, paymentType: string): Observable<any> {
    const headers = new HttpHeaders({
      'token': token,
      'deviceid': deviceId,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.backendApi}/payments/createPaymentSession`, { orderID, paymentType }, { headers });
  }
}

