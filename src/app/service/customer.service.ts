import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page, TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';
import { Customer } from '../models/customer.model';

export interface PageFilterCustomer extends Page {
    keyword?: string;
    warehouseId?: number;
    positionId?: number;
    departmentId?: number;
    requestPassword?: boolean;
    quit?: boolean;
    gender?: number;
    birthday?: Date;
    startDate?: Date;
    endDate?: Date;
    currentPage?: number;
    pagesize?: number;
    targetId?: number;
    typeOfWork?: number;
    month?: number;
    degreeId?: number;
    certificatedId?: number;
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Customers`;
let _prefixUpload = `${AppConstant.DEFAULT_URLS.API}/ReportDownload`;

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    constructor(private readonly httpClient: HttpClient) {}

    public getPagingCustomer(params: any): Observable<TypeData<Customer>> {
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((customer: TypeData<Customer>) => {
                return customer;
            })
        );
    }

    public getAllCustomer(): Observable<TypeData<Customer>> {
        return this.httpClient.get(`${_prefix}/list`).pipe(
            map((customer: TypeData<Customer>) => {
                return customer;
            })
        );
    }

    public getCustomerDetail(id: number): Observable<Customer> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.get(url, {}).pipe(
            map((customer: Customer) => {
                return customer;
            })
        );
    }

    public createCustomer(customer: Customer): Observable<Customer | null> {
        const url: string = `${_prefix}`;
        return this.httpClient.post(url, customer).pipe(
            map((customer: Customer) => {
                return customer;
            })
        );
    }

    public updateCustomer(customer: Customer, id: number): Observable<Customer> {
        console.log(customer);
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.put(url, customer).pipe(
            map((customer: Customer) => {
                return customer;
            })
        );
    }

    public deleteCustomer(id: number): Observable<Customer | null> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((customer: Customer) => {
                return customer;
            })
        );
    }

    uploadFiles(formData): Observable<any> {
        return this.httpClient
            .post(`${_prefixUpload}/uploadImage`, formData, {
                reportProgress: true,
                observe: 'events',
            })
            .pipe(catchError(this.errorMgmt));
    }

    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

    getExcelReport(param: PageFilterCustomer): Observable<{ dt: string }> {
        let url: string = `${_prefix}/export-excel-customer`;

        return this.httpClient.get(url).pipe(
            map((data: { dt: string }) => {
                return data;
            })
        );
    }

    getFolderPathDownload(f: string, t: string): string {
        var k =
            environment.serverURL +
            '/ReportDownload/DownloadReportFromFile' +
            `?filename=${f}&fileType=${t}`;
        return k;
    }

    importExcel(formData): Observable<any> {
        return this.httpClient.post(`${_prefix}/import-customer`, formData).pipe(
            map((data: any) => {
                return data;
            })
        );
    }
}
