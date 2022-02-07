import { Component, OnInit } from '@angular/core';
import { Api } from 'src/app/common/api-constant';
import { CommonKeyValueModel } from 'src/app/common/common.model';
import { CommonService } from 'src/app/common/common.service';
import { NotiType } from 'src/app/common/constant';
import { GlobalVariable } from 'src/app/common/global-variable';
import { LanguageTypeEnum } from 'src/app/enums/language-type.enum';
import { environment } from 'src/environments/environment';
import { CartModel, CartProductItem } from './dto/cart-response.dto';
import { CreateProductOrderDto, OrderCreateDto } from './dto/order-create.dto';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  private server = environment.serverApi;
  orderCreate: OrderCreateDto = new OrderCreateDto();
  cartModel: CartModel = new CartModel();
  provinceId: string = '';
  provinces: CommonKeyValueModel[] = [];
  districtId: string = '';
  districts: CommonKeyValueModel[] = [];
  wardId: string = '';
  wards: CommonKeyValueModel[] = [];
  shippingAddress: string = '';
  fullName: string = '';
  tell: string = '';
  constructor(
    private commonService: CommonService,
    private globalVariable: GlobalVariable
  ) {}

  ngOnInit(): void {
    this.getCart();
    this.getProvince();
    this.globalVariable.setshowdDropdownMenu(false);
  }
  getCart(): void {
    this.cartModel.goods = [];
    this.commonService.httpGetAll(Api.CART_BY_CUSTOMER).subscribe(
      (res) => {
        if (!res || !res.state) {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Lối lấy dữ liệu'
          );
        }
        const goods: CartProductItem[] = [];
        res.data?.map((cart: any) => {
          const cartProductItem = new CartProductItem();
          cartProductItem.good = {
            name: cart.goodName,
            price: cart.price,
            type: LanguageTypeEnum.VIETNAM,
            images: cart.images?.map((image: string) => {
              return this.server + '/' + image;
            }),
            rate: 100,
            reviews: 100,
          };
          cartProductItem.quantity = cart.quantity;
          cartProductItem.totalPrice =
            Number(cart.quantity || 0) *
            Number(cartProductItem.good.price || 0);
          goods.push(cartProductItem);
        });
        this.cartModel.goods = goods;
        this.cartModel.totalPrice = this.cartModel.goods?.reduce(
          (total, curr) => {
            return total + curr.totalPrice;
          },
          0
        );
      },
      (er) => {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Lối lấy dữ liệu'
        );
      }
    );
  }
  getProvince(): void {
    this.commonService.httpGetAll(Api.ADDRESS_GET_PROVINCE).subscribe((res) => {
      if (res && res.state) {
        this.provinces = res.data?.map((province: any) => {
          return {
            key: province.name,
            value: province.id,
          };
        });
      }
    });
  }
  getDistrict(): void {
    this.commonService
      .httpGetById(Number(this.provinceId || 0), Api.ADDRESS_GET_DISTRICT)
      .subscribe((res) => {
        if (res && res.state) {
          this.districts = res.data?.map((district: any) => {
            return {
              key: district.name,
              value: district.id,
            };
          });
        }
      });
  }
  getWard(): void {
    this.commonService
      .httpGetById(Number(this.districtId || 0), Api.ADDRESS_GET_WARD)
      .subscribe((res) => {
        if (res && res.state) {
          this.wards = res.data?.map((ward: any) => {
            return {
              key: ward.name,
              value: ward.id,
            };
          });
        }
      });
  }
  reduceQty(item: CartProductItem): void {
    item.quantity -= 1;
    item.quantity = item.quantity < 0 ? 0 : item.quantity;
    item.totalPrice = item.quantity * Number(item.good?.price || 0);
    this.cartModel.totalPrice = this.cartModel.goods?.reduce((total, curr) => {
      return total + curr.quantity * Number(curr.good?.price || 0);
    }, 0);
  }
  increaseQty(item: CartProductItem): void {
    item.quantity += 1;
    item.totalPrice = item.quantity * Number(item.good?.price || 0);
    this.cartModel.totalPrice = this.cartModel.goods?.reduce((total, curr) => {
      return total + curr.quantity * Number(curr.good?.price || 0);
    }, 0);
  }
  createOrder(): void {
    const goods: CreateProductOrderDto[] = this.cartModel.goods?.map(
      (good: CartProductItem) => {
        const _good = new CreateProductOrderDto();
        _good.goodId = good.good?.id;
        _good.goodDetailId = good.goodDetail?.id;
        _good.quantity = good.quantity;
        return _good;
      }
    );
    const orderDto: OrderCreateDto = {
      goods: goods,
      fullName: this.fullName,
      tell: this.tell,
      districtId: Number(this.districtId || 0),
      provinceId: Number(this.provinceId || 0),
      wardId: Number(this.wardId || 0),
      shippingAddress: this.shippingAddress,
    };
    this.commonService.httpPost(orderDto, Api.ORDER_CREATE).subscribe(
      (res) => {
        if (res && res.state) {
          this.commonService.createNotification(
            NotiType.SUCCESS,
            'Thông báo',
            'Tạo đơn hàng thành công'
          );
        } else {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Tạo đơn hàng thất bại'
          );
        }
      },
      (er) => {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Tạo đơn hàng thất bại'
        );
      }
    );
  }
}
