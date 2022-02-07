export enum CartStateEnum {
  WAIT = 0,
  BOUGHT = 1,
  DELETED = 2,
}
export class OrderCreateDto {
  goods: CreateProductOrderDto[] = [];
  shippingAddress?: string;
  tell?: string;
  fullName?: string;
  wardId?: number;
  districtId?: number;
  provinceId?: number;
}

export class CreateProductOrderDto {
  goodId?: number;
  goodDetailId?: number;
  quantity?: number;
}
export class CartCreateModel {
  id?: number;
  goodId?: number;
  customerId?: number;
  quantity?: number;
  state?: CartStateEnum;
  goodCode?: string;
  goodName?: string;
  price?: number;
  priceDiscount?: number;
  totalPrice?: number;
  images?: string[];
}
