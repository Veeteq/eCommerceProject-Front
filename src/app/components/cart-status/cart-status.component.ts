import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalValue: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus() {
    this.cartService.totalValue.subscribe(data => {
      this.totalValue = data;
    });
  
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    });
  }

}
