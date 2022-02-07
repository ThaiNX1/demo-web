import { SearchCriteria } from 'src/app/common/common.model';

export class ProductSearchModel extends SearchCriteria {
  constructor() {
    super();
  }
  keyword: string = '';
  categoryCode: string = '';
  sortType: SortType = 1;
}
export enum SortType {
  INCREASE_PRICE = 1,
  REDUCE_PRICE = 2,
}
