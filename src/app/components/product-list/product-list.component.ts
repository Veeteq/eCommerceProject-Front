import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from 'src/app/common/cart-item';
import { Page } from 'src/app/common/page';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  product: Product;
  categoryId: number;
  previousCategoryId: number;
  previousKeyword: string;
  searchMode: boolean;
  page: Page = new Page();

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('inside ngOnInit');
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    console.log('inside handleSearchProducts');
    const keyword: string = String(this.route.snapshot.paramMap.get('keyword'));
    console.log(`keyword=${keyword}`);

    if (this.previousKeyword != keyword) {
      this.page.number = 1;
    }
    this.previousKeyword = keyword;

    this.productService.searchProductsByKeyword(this.page.number - 1, this.page.size, keyword)
      .subscribe(data => {
        this.products = data._embedded.product;
        this.page = data.page;
        this.page.number++;
      });
  }

  handleListProducts() {
    console.log('inside handleListProducts');
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.categoryId = 1;
    }

    if (this.previousCategoryId != this.categoryId) {
      this.page.number = 1;
    }
    this.previousCategoryId = this.categoryId;

    this.productService.getProductList(this.page.number - 1, this.page.size, this.categoryId)    
      .subscribe(data => {
        //console.log('Products: ' + JSON.stringify(data._embedded));
        this.products = data._embedded.product;
        this.page = data.page;
        this.page.number++;
    });
  }

  updatePageSize(event: any) {
    const value = event.target.value;
    console.log(value);
    this.page.size = value;
    this.page.number = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`addToCart: ${product.name}, ${product.unitPrice}`);

    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
