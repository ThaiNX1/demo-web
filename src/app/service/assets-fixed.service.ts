import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { FixedAssetsType } from '../enums/fixed-assets=type';
import { FixedAssets } from '../models/assets-fixed.model';
import { Page, TypeData } from '../models/common.model';
import { CustomActionResult } from '../models/custom-action-result.model';
import AppConstant from '../utilities/app-constants';

export interface PageFilterAssets extends Page {
    keyword?: string;
    FilterType: FixedAssetsType;
    FilterMonth: number;
}

@Injectable({
    providedIn: 'root',
})
export class AssetsFixedService {
    constructor(private readonly httpClient: HttpClient) {}
    private readonly _baseUrl = AppConstant.DEFAULT_URLS.API;
    private readonly apiPath: string = this._baseUrl + '/fixedAssets';

    public getListAssets(
        param: PageFilterAssets
    ): Observable<TypeData<FixedAssets>> {
        let url: string = `${this.apiPath}?FilterType=${param.FilterType}&FilterMonth=${param.FilterMonth}&page=${param.page}&_pageSize=${param.pageSize}`;
        return this.httpClient.get(url).pipe(
            map((assets: TypeData<FixedAssets>) => {
                return assets;
            })
        );
    }

    public updateAsstes(
        entities: Array<FixedAssets>
    ): Observable<CustomActionResult<Array<FixedAssets>>> {
        return this.httpClient.post(`${this.apiPath}/update`, entities).pipe(
            map((assets: CustomActionResult<Array<FixedAssets>>) => {
                return assets;
            })
        );
    }

    public deleteAsstes(ids: Array<number>): Observable<FixedAssets | null> {
        const url: string = `${this.apiPath}/delete`;
        return this.httpClient.post(url, ids).pipe(
            map((assets: FixedAssets) => {
                return assets;
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
}
