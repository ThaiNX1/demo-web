/** Common Class dùng cho dropdown và  */
export class CommonKeyValueModel {
  key: string="";
  value?: string;
}

/** Base model */
export class BaseModel {
  id?: number;
  createAt?: Date;
  updateAt?: Date;
  isDelete?: boolean;
  userCreated?: number;
  userUpdated?: number;
}

/** Tìm kiếm cơ bản */
export class SearchCriteria {
  constructor() {
    this.page = 1;
    this.pageSize = 20;
    this.textSearch = '';
  }
  page?: number;
  pageSize: number;
  textSearch: string;
}

/** Dữ liệu trả về */
export class DataResult<T> {
  page?: number;
  pageSize?: number;
  totalItem?: number;
  data: T[] = [];
}

/** Response trả về từ API */
export class ResponseModel {
  state: boolean = true;
  code: number = 200;
  message: string = '';
  data: any;
}
