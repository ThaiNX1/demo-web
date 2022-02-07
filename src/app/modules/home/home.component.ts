import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Api } from 'src/app/common/api-constant';
import { CommonKeyValueModel } from 'src/app/common/common.model';
import { CommonService } from 'src/app/common/common.service';
import { NotiType } from 'src/app/common/constant';
import { GlobalVariable } from 'src/app/common/global-variable';
import { LanguageTypeEnum } from 'src/app/enums/language-type.enum';
import { ProductModel } from 'src/app/models/product.model';
import { SliderModel } from 'src/app/models/slider.model';
import { environment } from 'src/environments/environment';
import { ItemModel } from './dto/home-response.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private server = environment.serverApi;
  sliders: string[] = [];
  boxSides: ItemModel[] = [];
  products: ProductModel[] = [];
  constructor(
    private globalVariable: GlobalVariable,
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.globalVariable.setshowdDropdownMenu(true);
    this.getSlider();
    this.getProductDealToday();
    this.boxSides = [
      {
        key: '',
        value: 'Miễn phí ship và đổi trả',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>'
        ),
        content: 'Dành cho tất cả đơn hàng từ 99K',
      },
      {
        key: '',
        value: 'Thanh toán an toàn',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-briefcase" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/></svg>'
        ),
        content: 'Các phương thức thanh toán an toàn',
      },
      {
        key: '',
        value: 'Chế độ bảo hành',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>'
        ),
        content: 'Đổi trả trong vòng 30 ngày',
      },
      {
        key: '',
        value: 'Hỗ trợ khách hàng',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>'
        ),
        content: 'Gọi điện hoặc Email 24/7',
      },
    ];
  }

  /** Lấy danh sách slider hiển thị trang Home */
  getSlider(): void {
    this.commonService.httpGetAll(Api.GET_ALL_SLIDER).subscribe((res) => {
      if (!res || !res.state) {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Lỗi lấy dữ liệu slider!'
        );
      } else {
        this.sliders = res.data?.map(
          (m: SliderModel) => this.server + '/' + m.img
        );
      }
    });
  }
  /** Lấy danh sách sản phẩm KM Hôm nay */
  getProductDealToday(): void {
    this.commonService.httpGetAll(Api.GET_TOP_PRODUCT_DEAL).subscribe((res) => {
      if (res && res.state) {
        this.products = res.data?.map((prod: any) => {
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
    });
  }
}
