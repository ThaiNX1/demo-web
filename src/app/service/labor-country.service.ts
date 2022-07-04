import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page, TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';
import { LaborCountry } from '../models/labor-country.model';

export interface PageFilterLaborCountry extends Page {
    provinceIds?: number[];
    districtIds?: number[];
    wardIds?: number[];
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/LaborCountry`;

@Injectable({
    providedIn: 'root'
})
export class LaborCountryService {
    constructor(private readonly httpClient: HttpClient) { }

    public getListLaborCountry(params: any): Observable<TypeData<LaborCountry>> {
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((LaborCountry: TypeData<LaborCountry>) => {
                return LaborCountry;
            })
        );
    }

    public getAllLaborCountry(): Observable<TypeData<LaborCountry>> {
        return this.httpClient.get(`${_prefix}/getLaborCountry`).pipe(
            map((LaborCountry: TypeData<LaborCountry>) => {
                return LaborCountry;
            })
        );
    }

    public getLaborCountryDetail(id: number): Observable<LaborCountry> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.get(url, {}).pipe(
            map((LaborCountry: LaborCountry) => {
                return LaborCountry;
            })
        );
    }

    public createLaborCountry(LaborCountry: LaborCountry): Observable<LaborCountry | null> {
        const url: string = `${_prefix}`;
        return this.httpClient.post(url, LaborCountry).pipe(
            map((LaborCountry: LaborCountry) => {
                return LaborCountry;
            })
        );
    }

    public updateLaborCountry(laborCountry: LaborCountry, id: number): Observable<LaborCountry> {
        console.log(laborCountry);
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.put(url, laborCountry).pipe(
            map((LaborCountry: LaborCountry) => {
                return LaborCountry;
            })
        );
    }

    public deleteLaborCountry(id: number): Observable<LaborCountry | null> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((LaborCountry: LaborCountry) => {
                return LaborCountry;
            })
        );
    }

    uploadFiles(formData): Observable<any> {
        return this.httpClient.post(`${_prefix}/uploadImage`, formData, {
                reportProgress: true,
                observe: 'events',
            })
            .pipe(catchError(this.errorMgmt));
    }

    deleteFiles(paths): Observable<any> {
        let data = [];
        for (let i = 0; i < paths.length; i++) {
            data.push({ imageUrl: paths[i] });
        }
        const url: string = `${_prefix}/deleteImages`;
        return this.httpClient.post(url, data).pipe(
            map((imageUrl: string) => {
                return imageUrl;
            })
        );
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

    getExcelReport(param: PageFilterLaborCountry): Observable<{ dt: string }> {
        let url: string = `${_prefix}/export`;

        return this.httpClient.get(url)
            .pipe(map((data: { dt: string }) => {
                return data;
            }));
    }

    getFolderPathDownload(f: string, t: string): string {
        var k = environment.serverURL + "/ReportDownload/DownloadReportFromFile" + `?filename=${f}&fileType=${t}`;
        return k;
    }

    importExcel(formData): Observable<any> {
        return this.httpClient.post(`/api/LaborCountry/import`, formData)
            .pipe(map((data: any) => {
                return data;
            }));
    }
}
