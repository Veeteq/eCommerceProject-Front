import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';
import { Page } from '../common/page';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private endpoint = environment.backendUrl;
  private baseUrl: string = `${this.endpoint}/orders`;

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<OrderHistoryResponse> {
    console.log(`getOrderHistory(email=${email})`);
    const url = `${this.baseUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    console.log(url);
    return this.httpClient.get<OrderHistoryResponse>(url);
  }
}

interface OrderHistoryResponse {
  _embedded: {
    order: OrderHistory[];
  },
  page: Page;
}
