import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from './common.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginResponse } from '../modules/login/dto/login-response.dto';
import { ProductSearchModel } from '../modules/product/dto/product-filter.dto';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly server = environment.serverApi;
  searchProductModel: ProductSearchModel = new ProductSearchModel();
  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) {}

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  /** Get: Lấy toàn bộ danh sách */
  httpGetAll(urlApi: string): Observable<any> {
    const options: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    };
    return this.http.get<ResponseModel>(this.server + urlApi, options);
  }

  /** Get bằng tham số truyền lên */
  httpGetByParams(params: HttpParams, urlApi: string): Observable<any> {
    const options: any = {
      ContentType: 'application/json; charset=utf-8',
      params: params,
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    };
    return this.http.get<ResponseModel>(this.server + urlApi, options);
  }

  /** Get bằng tham số truyền lên */
  httpGetById(id: number, urlApi: string): Observable<any> {
    const options: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    };
    return this.http.get<ResponseModel>(
      this.server + urlApi + '/' + id,
      options
    );
  }

  /** Post: Tạo mới, tìm kiếm */
  httpPost(model: any, urlApi: string): Observable<any> {
    const options: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    };
    return this.http.post<ResponseModel>(this.server + urlApi, model, options);
  }

  /** Put: Cập nhật thông tin */
  httpPut(model: any, urlApi: string): Observable<any> {
    const options: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    };
    return this.http.put<ResponseModel>(this.server + urlApi, model, options);
  }

  /** Delete: Xóa thông tin */
  httpDelete(id: number, urlApi: string): Observable<any> {
    const options: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    };
    return this.http.put<ResponseModel>(
      this.server + urlApi + '/' + id,
      options
    );
  }

  /** Tạo thông báo, type: 'success','info','warning','error' */
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  /** Lấy thông tin user đã đăng nhập */
  getUserInfo(): LoginResponse {
    const user = localStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user) as LoginResponse;
    }
    return new LoginResponse();
  }
}
