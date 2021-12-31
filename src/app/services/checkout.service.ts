import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PaymentInfo } from "../common/payment-info";
import { Purchase } from "../common/purchase";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private endpoint = environment.backendUrl;
  private purchaseUrl: string = `${this.endpoint}/checkout/purchase`;
  private paymentIntentUrl: string = `${this.endpoint}/checkout/payment-intent`;

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}