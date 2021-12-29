import { CartItem } from "./cart-item";

export class OrderItem {
  productId: number;
  imageUrl: string;
  quantity: number;
  unitPrice: number;

  constructor(cartItem: CartItem) {
    this.productId = cartItem.id;
    this.imageUrl = cartItem.imageUrl;
    this.quantity = cartItem.quantity;
    this.unitPrice = cartItem.unitPrice;
  }
}