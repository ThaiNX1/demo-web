import { BaseModel } from '../common/common.model';
import { LanguageTypeEnum } from '../enums/language-type.enum';

/** Thông tin sản phẩm */
export class ProductModel extends BaseModel {
  constructor() {
    super();
    this.name = '';
    this.images = [];
    this.rate = 0;
    this.price = 0;
    this.discountPrice = 0;
    this.reviews = 0;
    this.type = LanguageTypeEnum.VIETNAM;
  }
  name?: string;
  images?: string[];
  rate?: number;
  price?: number;
  discountPrice?: number;
  reviews?: number;
  type?: LanguageTypeEnum;
}
/** Thông tin chi tiết sản phẩm */
export class ProductDetail {
  good?: GoodModel;
  images?: string[];
  details?: GoodDetailModel[] | [];
  type?: LanguageTypeEnum;
  description: any;
}
export class GoodModel extends BaseModel {
  menuType?: string;
  priceList?: string;
  goodsType?: string;
  salePrice?: number;
  price?: number;
  discountPrice?: number;
  inventory?: number;
  position?: string;
  delivery?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  status?: number;
  account?: string;
  accountName?: string;
  warehouse?: string;
  warehouseName?: string;
  detail1?: string;
  detailName1?: string;
  detail2?: string;
  detailName2?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  isDeleted?: boolean = false;
  webGoodNameVietNam?: string;
  webPriceVietNam?: number;
  webDiscountVietNam?: number;
  titleVietNam?: string;
  contentVietNam?: string;
  webGoodNameKorea?: string;
  webPriceKorea?: number;
  webDiscountKorea?: number;
  titleKorea?: string;
  contentKorea?: string;
  webGoodNameEnglish?: string;
  webPriceEnglish?: number;
  webDiscountEnglish?: number;
  titleEnglish?: string;
  contentEnglish?: string;
}
export class GoodDetailModel {
  iD?: number;
  account?: string;
  accountName?: string;
  detail1?: string;
  detailName1?: string;
  detail2?: string;
  detailName2?: string;
  warehouse?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
  accountParent?: string;
  accountNameParent?: string;
  detail1Parent?: string;
  detailName1Parent?: string;
  detail2Parent?: string;
  detailName2Parent?: string;
  warehouseParent?: string;
  isDeleted?: boolean;
  goodID?: number;
}
