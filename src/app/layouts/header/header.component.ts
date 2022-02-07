import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from 'src/app/common/api-constant';
import { CommonKeyValueModel } from 'src/app/common/common.model';
import { CommonService } from 'src/app/common/common.service';
import { NotiType } from 'src/app/common/constant';
import { GlobalVariable } from 'src/app/common/global-variable';
import { CategoryModel } from 'src/app/models/category.model';
import { HomeSearchDto } from 'src/app/modules/home/dto/home-search.dto';
import { LoginResponse } from 'src/app/modules/login/dto/login-response.dto';
import { navItems } from '../_nav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public navItems = navItems;
  showDropdown = false;
  categories: CategoryModel[] = [];
  search: HomeSearchDto = new HomeSearchDto();
  userInfo: LoginResponse = new LoginResponse();
  count = 0;
  constructor(
    private globalVariable: GlobalVariable,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.globalVariable.showdDropdownMenu.subscribe((isShow) => {
      this.showDropdown = isShow;
      if (this.showDropdown) {
        document
          .getElementById('dropdownMenu')
          ?.setAttribute('class', 'dropdown category-dropdown show-dropdown');
      }else{
        document
          .getElementById('dropdownMenu')
          ?.setAttribute('class', 'dropdown category-dropdown');
      }
    });
    this.getCategories();
    this.countCart();
    this.userInfo = this.commonService.getUserInfo();
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
  /** Chuyển đến trang danh sách sản phẩm theo danh mục */
  onSearchProductByCategory(categoryCode?: string): void {
    this.commonService.searchProductModel.categoryCode = categoryCode || '';
    this.globalVariable.setshowdDropdownMenu(false);
    this.router.navigate(['/product']);
  }

  /** Event scroll */
  onChange(status: boolean): void {
    const elementDOM = document.getElementById('dropdownMenu');
    if (this.showDropdown) {
      if (!status) {
        elementDOM?.setAttribute(
          'class',
          'dropdown category-dropdown show-dropdown'
        );
      } else {
        elementDOM?.setAttribute(
          'class',
          'dropdown category-dropdown has-border'
        );
      }
    }
  }
  countCart(): void {
    this.commonService.httpGetAll(Api.CART_COUNT).subscribe((res) => {
      this.count = Number(res || 0);
    });
  }
  homePage(): void {
    this.router.navigate(['/home']);
  }
  productPage(): void {
    this.router.navigate(['/product']);
  }
  cartPage(): void {
    this.router.navigate(['/cart']);
  }
  loginPage(): void {
    this.router.navigate(['/login']);
  }
  submit(): void {
    this.commonService.searchProductModel.keyword = this.search.textSearch;
    this.commonService.searchProductModel.categoryCode = this.search.type || '';
    this.router.navigate(['/product']);
  }
}
