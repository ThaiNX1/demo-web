import { ProductModel } from 'src/app/models/product.model';

export class CartModel {
  goods: CartProductItem[] = [new CartProductItem()];
  totalPrice: number = 0;
}
export class CartProductItem {
  constructor() {
    this.good = new ProductModel();
    this.quantity = 0;
    this.totalPrice = 0;
    this.goodDetail = new ProductModel();
  }
  good?: ProductModel;
  goodDetail?: ProductModel;
  quantity: number = 0;
  totalPrice: number = 0;
}
