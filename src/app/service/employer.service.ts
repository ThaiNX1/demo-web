import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page, TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';

export interface PageFilterEmployer extends Page {
    provinceIds?: number[];
    districtIds?: number[];
    wardIds?: number[];
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Employer`;

@Injectable({
    providedIn: 'root',
})
export class EmployerService {
    constructor(private readonly httpClient: HttpClient) {}

    public getListEmployerWebHome(): Observable<TypeData<any>> {
        return this.httpClient.get(`${_prefix}/list-employer-web-home`).pipe(
            map((employer: TypeData<any>) => {
                return employer;
            })
        );
    }
}
