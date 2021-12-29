import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

const cartItemsKey: string = 'cartItems';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalValue: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem(cartItemsKey)!);
    if (data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }
   }

  addToCart(cartItem: CartItem) {
    let existsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    existingCartItem = this.cartItems.find(el => el.id === cartItem.id)!;

    existsInCart = (existingCartItem != undefined);
    if (existsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalValue: number = 0;
    let totalQuantity: number = 0;

    for (let tmpCartItem of this.cartItems) {
      totalValue += tmpCartItem.quantity * tmpCartItem.unitPrice;
      totalQuantity += tmpCartItem.quantity;
    }

    this.totalValue.next(totalValue);
    this.totalQuantity.next(totalQuantity);

    this.persistCartItems();
  }

  removeFromCart(cartItem: CartItem) {
    let existsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    existingCartItem = this.cartItems.find(el => el.id === cartItem.id)!;
    existsInCart = (existingCartItem != undefined);
    if (existsInCart && existingCartItem.quantity > 1) {
      existingCartItem.quantity--;
    } else if (existsInCart && existingCartItem.quantity == 1) {
      const index = this.cartItems.findIndex(el => el.id == cartItem.id);
      if (index > -1) {
        this.cartItems.splice(index, 1);
      }
    }

    this.computeCartTotals();
  }

  persistCartItems() {
    this.storage.setItem(cartItemsKey, JSON.stringify(this.cartItems));
  }
}
