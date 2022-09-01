import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page, TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';
import { AccountGroupDetailModel, ImportExportAcccountQueryParam } from '../models/account-group.model';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ChartOfAccounts`;

@Injectable({
    providedIn: 'root',
})
export class AccountGroupService {
    mockData = false;

    constructor(private readonly httpClient: HttpClient) {}

    getListDetail(params: any): Observable<TypeData<AccountGroupDetailModel>> {
        const data$ = of(<TypeData<any>>{
            data: [{
                "id": 1,
                "code": "111",
                "name": "Tiền mặt",
                "openingDebit": 0,
                "openingCredit": 0,
                "arisingDebit": 0,
                "arisingCredit": 0,



                "isForeignCurrency": false,

                "arisingForeignDebit": 0,
                "arisingForeignCredit": 0,
                "openingForeignDebit": 0,
                "openingForeignCredit": 0,

                "type": 1,
                "classification": 1,
                "accGroup": 1,
                "duration": "N",
                "isProtected": false,
                "displayInsert": false,

                "displayDelete": false,


                "parentRef": "",
                "hasChild": true,
                "hasDetails": false,




                "stockUnitPrice": null,
                "stockUnit": null,
                "warehouseCode": null,
                "openingStockQuantity": null,


                "openingStockQuantityNb": null,
                "stockUnitPriceNb": null,
                "openingDebitNb": null,
                "openingCreditNb": null,
                "openingForeignDebitNb": null,
                "openingForeignCreditNb": null
            }, {
                "id": 2,
                "code": "1111",
                "name": "Tiền Việt Nam",
                "openingDebit": 0,
                "openingCredit": 0,
                "arisingDebit": 0,
                "arisingCredit": 0,



                "isForeignCurrency": false,

                "arisingForeignDebit": 0,
                "arisingForeignCredit": 0,
                "openingForeignDebit": 0,
                "openingForeignCredit": 0,

                "type": 2,
                "classification": 1,
                "accGroup": 2,
                "duration": "N",
                "isProtected": false,
                "displayInsert": true,

                "displayDelete": true,


                "parentRef": "111",
                "hasChild": false,
                "hasDetails": false,




                "stockUnitPrice": null,
                "stockUnit": null,
                "warehouseCode": null,
                "openingStockQuantity": null,


                "openingStockQuantityNb": null,
                "stockUnitPriceNb": null,
                "openingDebitNb": null,
                "openingCreditNb": null,
                "openingForeignDebitNb": null,
                "openingForeignCreditNb": null
            }, {
                "id": 3,
                "code": "1112",
                "name": "Ngoại tệ",
                "openingDebit": 0,
                "openingCredit": 0,
                "arisingDebit": 0,
                "arisingCredit": 0,



                "isForeignCurrency": false,

                "arisingForeignDebit": 0,
                "arisingForeignCredit": 0,
                "openingForeignDebit": 0,
                "openingForeignCredit": 0,

                "type": 2,
                "classification": 1,
                "accGroup": 3,
                "duration": "N",
                "isProtected": false,
                "displayInsert": true,

                "displayDelete": true,


                "parentRef": "111",
                "hasChild": false,
                "hasDetails": false,




                "stockUnitPrice": null,
                "stockUnit": null,
                "warehouseCode": null,
                "openingStockQuantity": null,


                "openingStockQuantityNb": null,
                "stockUnitPriceNb": null,
                "openingDebitNb": null,
                "openingCreditNb": null,
                "openingForeignDebitNb": null,
                "openingForeignCreditNb": null
            }, {
                "id": 24,
                "code": "1332",
                "name": "Thuế GTGT được khấu trừ của TSCĐ",
                "openingDebit": 0,
                "openingCredit": 0,
                "arisingDebit": 0,
                "arisingCredit": 0,



                "isForeignCurrency": false,

                "arisingForeignDebit": 0,
                "arisingForeignCredit": 0,
                "openingForeignDebit": 0,
                "openingForeignCredit": 0,

                "type": 1,
                "classification": 1,
                "accGroup": 1,
                "duration": "N",
                "isProtected": false,
                "displayInsert": true,

                "displayDelete": false,


                "parentRef": "133",
                "hasChild": true,
                "hasDetails": true,




                "stockUnitPrice": null,
                "stockUnit": null,
                "warehouseCode": null,
                "openingStockQuantity": null,


                "openingStockQuantityNb": null,
                "stockUnitPriceNb": null,
                "openingDebitNb": 0,
                "openingCreditNb": 0,
                "openingForeignDebitNb": 0,
                "openingForeignCreditNb": 0
            }, {
                "id": 11,
                "code": "1132",
                "name": "Ngoại tệ",
                "openingDebit": 0,
                "openingCredit": 0,
                "arisingDebit": 0,
                "arisingCredit": 0,



                "isForeignCurrency": false,

                "arisingForeignDebit": 0,
                "arisingForeignCredit": 0,
                "openingForeignDebit": 0,
                "openingForeignCredit": 0,

                "type": 2,
                "classification": 1,
                "accGroup": 4,
                "duration": "N",
                "isProtected": false,
                "displayInsert": true,

                "displayDelete": true,


                "parentRef": "113",
                "hasChild": false,
                "hasDetails": false,




                "stockUnitPrice": null,
                "stockUnit": null,
                "warehouseCode": null,
                "openingStockQuantity": null,


                "openingStockQuantityNb": null,
                "stockUnitPriceNb": null,
                "openingDebitNb": null,
                "openingCreditNb": null,
                "openingForeignDebitNb": null,
                "openingForeignCreditNb": null
            }, {
                "id": 12,
                "code": "121",
                "name": "Chứng khoán kinh doanh",
                "openingDebit": 0,
                "openingCredit": 0,
                "arisingDebit": 0,
                "arisingCredit": 0,



                "isForeignCurrency": false,

                "arisingForeignDebit": 0,
                "arisingForeignCredit": 0,
                "openingForeignDebit": 0,
                "openingForeignCredit": 0,

                "type": 1,
                "classification": 1,
                "accGroup": 4,
                "duration": "N",
                "isProtected": false,
                "displayInsert": false,

                "displayDelete": false,


                "parentRef": "",
                "hasChild": true,
                "hasDetails": false,




                "stockUnitPrice": null,
                "stockUnit": null,
                "warehouseCode": null,
                "openingStockQuantity": null,


                "openingStockQuantityNb": null,
                "stockUnitPriceNb": null,
                "openingDebitNb": null,
                "openingCreditNb": null,
                "openingForeignDebitNb": null,
                "openingForeignCreditNb": null
            }],
        });

        const request$ = this.mockData ? data$ : this.httpClient.get(`${_prefix}`, {params});
        
        return request$.pipe(
            map((data: TypeData<AccountGroupDetailModel>) => {
                return data;
            })
        );
    }

    getListDetailForChildNode(parentCode: string, params: any) : Observable<TypeData<any>> {

        const data$ = of(<TypeData<any>>{
            data: [],
        });
        
        const request$ = this.mockData ? data$ : this.httpClient.get(`${_prefix}/details/${parentCode}`, {params});
        
        return request$.pipe(
            map((data: TypeData<AccountGroupDetailModel>) => {
                return data;
            })
        );
    }

    validateExistingAccount(code: string): Observable<any> {
        return this.httpClient.get(`${_prefix}/check-account-test/${code}`); 
    }

    postCreateAccount(data: AccountGroupDetailModel): Observable<any> {
        return this.httpClient.post(`${_prefix}/create`, data);
    }

    putAccount(data: AccountGroupDetailModel): Observable<any> {
        return this.httpClient.put(`${_prefix}`, data);
    }

    deleteAccount(id: number): Observable<any> {
        return this.httpClient.delete(`${_prefix}/${id}`);
    }

    importExcelTaiKhoan(parentCode: string, data: any) {
        return this.httpClient.post(`${_prefix}/importExcelTaiKhoan/${parentCode}`, data);
    }

    importTaiKhoanCT1(parentCode: string, data: any): Observable<any> {
        return this.httpClient.post(`${_prefix}/importTaiKhoanCT1/${parentCode}`, data);
    }

    exportTaiKhoanNoiBoChiTiet1(params: any): Observable<any> {
        return this.httpClient.get(`${_prefix}/ExportTaiKhoanNoiBoChiTiet1/`, {params: params});
    }


    postCreateDetail(data: AccountGroupDetailModel): Observable<any> {
        return this.httpClient.post(`${_prefix}/details`, data);
    }

    putDetail(data: AccountGroupDetailModel): Observable<any> {
        return this.httpClient.put(`${_prefix}/details`, data);
    }

    deleteDetail(id: number): Observable<any> {
        return this.httpClient.delete(`${_prefix}/details/${id}`);
    }

}
