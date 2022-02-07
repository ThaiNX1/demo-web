import { CommonKeyValueModel } from 'src/app/common/common.model';

/** Model dùng cho các hiển thị có icon */
export class ItemModel extends CommonKeyValueModel {
  constructor() {
    super();
    this.key = '';
    this.value = '';
    this.content = '';
  }
  icon?: any;
  content?: string;
}

export class ProductDeal{
  
}
