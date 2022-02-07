import { Component, OnInit } from '@angular/core';
import { Api } from 'src/app/common/api-constant';
import { DataResult, ResponseModel } from 'src/app/common/common.model';
import { CommonService } from 'src/app/common/common.service';
import { NotiType } from 'src/app/common/constant';
import { GlobalVariable } from 'src/app/common/global-variable';
import { LanguageTypeEnum } from 'src/app/enums/language-type.enum';
import { CategoryModel } from 'src/app/models/category.model';
import { GoodModel, ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { ProductSearchModel } from './dto/product-filter.dto';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  private server = environment.serverApi;
  productSearch: ProductSearchModel = new ProductSearchModel();
  categories: CategoryModel[] = [];
  searchResult: DataResult<ProductModel> = new DataResult<ProductModel>();
  constructor(
    private globalVariable: GlobalVariable,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.globalVariable.setshowdDropdownMenu(false);
    if (this.commonService.searchProductModel) {
      this.productSearch.categoryCode =
        this.commonService.searchProductModel.categoryCode || '';
      this.productSearch.keyword =
        this.commonService.searchProductModel.keyword;
    }
    this.getCategories();
    this.searchProduct();
  }
  /** Lấy danh sách danh mục hàng hóa */
  getCategories(): void {
    this.commonService.httpGetAll(Api.GET_ALL_CATEGORY).subscribe((res) => {
      if (!res || !res.state) {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Lỗi lấy dữ liệu danh mục!'
        );
      } else {
        this.categories = res.data;
      }
    });
  }
  setCategoryCode(code: string | undefined): void {
    this.productSearch.categoryCode = code ? code : '';
    this.searchProduct();
  }
  clearFillter(): void {
    this.productSearch = new ProductSearchModel();
    this.searchProduct();
  }
  searchProduct(): void {
    this.commonService.httpPost(this.productSearch, Api.GOOD_SEARCH).subscribe(
      (res: ResponseModel) => {
        if (!res || !res.state) {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Lỗi lấy danh sách sản phẩm'
          );
        }
        if (res.data) {
          this.searchResult.page = res.data.pageIndex;
          this.searchResult.pageSize = res.data.pageSize;
          this.searchResult.totalItem = res.data.totalItems;
          this.searchResult.data = res.data?.data?.map((prod: GoodModel) => {
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
      (er) => {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Lỗi lấy danh sách sản phẩm'
        );
      }
    );
  }
}
