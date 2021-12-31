import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map, tap } from 'rxjs/operators';
import { Category } from '../common/category';
import { Page } from '../common/page';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = environment.backendUrl;
  private baseUrl = `${this.endpoint}/products`;
  private categoryUrl = `${this.endpoint}/categories`;

  constructor(private httpClient: HttpClient) { }

  getProductList(pageNumber: number, size: number, categoryId: number): Observable<ProductResponse> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${size}`;
    console.log(url);
    return this.httpClient.get<ProductResponse>(url);
  }

  searchProductsByKeyword(pageNumber: number, size: number, keyword: string): Observable<ProductResponse> {
    const url = `${this.baseUrl}/search/findByNameContainingIgnoreCase?name=${keyword}&page=${pageNumber}&size=${size}`;

    return this.httpClient.get<ProductResponse>(url);
  }

  getCategoryList(): Observable<Category[]> {
    console.log('getCategoryList');
    return this.httpClient.get<CategoryResponse>(this.categoryUrl)
    .pipe(map(response => response._embedded.category));
  }  

  getProduct(productId: number): Observable<Product> {
    console.log(`getProduct(productId=${productId})`);;
    const url = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(url);
  }

  private getProducts(url: string): Observable<Product[]> {
    console.log('getProducts');
    return this.httpClient.get<ProductResponse>(url)
      .pipe(
        map(response => response._embedded.product)
      );
  }
}

interface ProductResponse {
  _embedded: {
    product: Product[];
  },
  page: Page;
}
 
interface CategoryResponse {
  _embedded: {
    category: Category[];
  }
}
