import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from 'src/app/common/api-constant';
import { ResponseModel } from 'src/app/common/common.model';
import { CommonService } from 'src/app/common/common.service';
import { NotiType } from 'src/app/common/constant';
import { GlobalVariable } from 'src/app/common/global-variable';
import { LanguageTypeEnum } from 'src/app/enums/language-type.enum';
import { ProductDetail, ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { CartModel } from '../cart/dto/cart-response.dto';
import { CartCreateModel, CartStateEnum } from '../cart/dto/order-create.dto';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  private server = environment.serverApi;
  topProductSelles: ProductModel[] = [];
  productInCategories: ProductModel[] = [];
  productSamples: ProductModel[] = [];
  productId: number = 0;
  productDetail: ProductDetail = new ProductDetail();
  productSell = 1;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private globalVariable: GlobalVariable
  ) {}

  ngOnInit(): void {
    const goodId = this.route.snapshot.paramMap.get('id');
    console.log(goodId);
    
    this.getProductDetail(Number(goodId || 0));
    this.globalVariable.setshowdDropdownMenu(false);
  }
  /** Lấy thông tin chi tiết hàng hóa */
  getProductDetail(id: number): void {
    this.commonService.httpGetById(id, Api.GOOD_BY_ID).subscribe(
      (res: ResponseModel) => {
        console.log('res',res);
        if (res && res.state) {
          this.productDetail = res.data;
          
          this.productDetail.images = this.productDetail.images?.reduce(
            (arr: string[], curr) => {
              if (curr) {
                arr.push(this.server + '/' + curr);
              }
              return arr;
            },
            []
          );
          this.productDetail.type = LanguageTypeEnum.VIETNAM;
          this.productDetail.description =
            this.sanitizer.bypassSecurityTrustHtml(
              this.productDetail?.good?.contentVietNam
                ? this.productDetail?.good?.contentVietNam
                : '<p></p>'
            );
          this.getTopPopularSell();
          this.getProductInCategory(this.productDetail.good?.goodsType ?? '');
        } else {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Lỗi lấy dữ liệu'
          );
          this.router.navigate(['/home']);
        }
      },
      (er) => {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Lỗi lấy dữ liệu'
        );
        this.router.navigate(['/home']);
      }
    );
  }

  /** Lấy danh sách hàng hóa cùng danh mục */
  getProductInCategory(categoryCode: string): void {
    const params = new HttpParams().set('code', categoryCode);
    this.commonService
      .httpGetByParams(params, Api.GOOD_SAMPLE_CATEGORY)
      .subscribe(
        (res: ResponseModel) => {
          if (res && res.state) {
            this.productInCategories = res.data?.map((prod: any) => {
              const product = new ProductModel();
              product.id = prod.id;
              product.name = prod.detailName2 || prod.detailName1;
              product.price = prod.price;
              product.discountPrice = prod.discountPrice;
              product.rate = 100;
              product.reviews = 100;
              product.images = [];
              if (prod?.image1) {
                product.images?.push(this.server + '/' + prod?.image1);
              }
              if (prod?.image2) {
                product.images?.push(this.server + '/' + prod?.image2);
              }
              if (prod?.image3) {
                product.images?.push(this.server + '/' + prod?.image3);
              }
              if (prod?.image4) {
                product.images?.push(this.server + '/' + prod?.image4);
              }
              if (prod?.image5) {
                product.images?.push(this.server + '/' + prod?.image5);
              }
              product.type = LanguageTypeEnum.VIETNAM;
              return product;
            });
          }
        },
        (er) => {}
      );
  }

  /** Lấy danh sách sản phẩm nổi bật */
  getTopPopularSell(): void {
    this.commonService.httpGetAll(Api.GOOD_TOP_SELL).subscribe(
      (res: ResponseModel) => {
        if (res && res.state) {
          this.topProductSelles = res.data?.map((prod: any) => {
            const product = new ProductModel();
            product.id = prod.goodId;
            product.name = prod.good?.detailName2 || prod.good?.detailName1;
            product.price = prod.good?.price;
            product.discountPrice = prod.good?.discountPrice;
            product.rate = 100;
            product.reviews = 100;
            product.images = [];
            if (prod?.image1) {
              product.images?.push(this.server + '/' + prod.good?.image1);
            }
            if (prod?.image2) {
              product.images?.push(this.server + '/' + prod.good?.image2);
            }
            if (prod?.image3) {
              product.images?.push(this.server + '/' + prod.good?.image3);
            }
            if (prod?.image4) {
              product.images?.push(this.server + '/' + prod.good?.image4);
            }
            if (prod?.image5) {
              product.images?.push(this.server + '/' + prod.good?.image5);
            }
            product.type = LanguageTypeEnum.VIETNAM;
            return product;
          });
        }
      },
      (er) => {}
    );
  }
  reduceQty(): void {
    this.productSell -= 1;
    this.productSell = this.productSell < 0 ? 0 : this.productSell;
  }
  increaseQty(): void {
    this.productSell += 1;
  }
  addToCart(): void {
    const cart = new CartCreateModel();
    cart.goodId = this.productDetail.good?.id;
    cart.goodName =
      this.productDetail.good?.detailName2 ??
      this.productDetail.good?.detailName1;
    cart.price = this.productDetail.good?.price;
    cart.quantity = this.productSell;
    cart.state = CartStateEnum.WAIT;
    cart.totalPrice = Number(cart.price || 0) * cart.quantity;
    this.commonService.httpPost(cart, Api.CART_ADD_GOOOD).subscribe(
      (res) => {
        if (res && res.state) {
          this.commonService.createNotification(
            NotiType.SUCCESS,
            'Thông báo',
            'Đã thêm vào giỏ hàng'
          );
        } else {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Thêm giỏ hàng thất bại'
          );
        }
      },
      (er) => {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Thêm giỏ hàng thất bại'
        );
      }
    );
  }
}
