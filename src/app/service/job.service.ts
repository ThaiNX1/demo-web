import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page, TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';

export interface PageFilterJob extends Page {
    provinceIds?: number[];
    districtIds?: number[];
    wardIds?: number[];
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Job`;

@Injectable({
    providedIn: 'root',
})
export class JobService {
    constructor(private readonly httpClient: HttpClient) {}

    public getPagingJob(params: any): Observable<TypeData<any>> {
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((job: TypeData<any>) => {
                return job;
            })
        );
    }

    public getListJob(): Observable<TypeData<any>> {
        return this.httpClient.get(`${_prefix}/list`).pipe(
            map((job: TypeData<any>) => {
                return job;
            })
        );
    }

    public getListJobWebHome(): Observable<TypeData<any>> {
        return this.httpClient.get(`${_prefix}/list-job-web-home`).pipe(
            map((job: TypeData<any>) => {
                return job;
            })
        );
    }

    public getJobDetail(id: number): Observable<any> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.get(url, {}).pipe(
            map((job: any) => {
                return job;
            })
        );
    }

    public createJob(job: any): Observable<any | null> {
        const url: string = `${_prefix}`;
        return this.httpClient.post(url, job).pipe(
            map((job: any) => {
                return job;
            })
        );
    }

    public updateJob(job: any, id: number): Observable<any> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.put(url, job).pipe(
            map((job: any) => {
                return job;
            })
        );
    }

    public deleteJob(id: number): Observable<any | null> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((job: any) => {
                return job;
            })
        );
    }

    uploadFiles(formData): Observable<any> {
        return this.httpClient
            .post(`${_prefix}/uploadImage`, formData, {
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

    getExcelReport(param: PageFilterJob): Observable<{ dt: string }> {
        let url: string = `${_prefix}/export-excel-labor-country`;

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
        return this.httpClient.post(`/api/Job/import-bkhh`, formData).pipe(
            map((data: any) => {
                return data;
            })
        );
    }
}
