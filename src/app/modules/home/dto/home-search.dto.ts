import { SearchCriteria } from 'src/app/common/common.model';

export class HomeSearchDto extends SearchCriteria {
  constructor() {
    super();
    this.type = '';
  }
  type?: string;
}
