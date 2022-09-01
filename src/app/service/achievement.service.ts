import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Page, TypeData} from '../models/common.model';
import AppConstant from '../utilities/app-constants';
import {Branch} from '../models/branch.model';
import { Achievement } from '../models/achievement.model';

export interface PageFilterDecide extends Page {
}

let _prefix = `${AppConstant.DEFAULT_URLS.URL}/HistoryAchievements`;
@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  param =
  {
    "id": 0,
    "userId": 0,
    "description": "string",
    "fullName": "string",
    "name": "string",
    "code": "string",
    "note": "string",
    "date": "2022-08-29T12:23:54.818Z",
    "createAt": "2022-08-29T12:23:54.818Z",
    "updateAt": "2022-08-29T12:23:54.818Z",
    "deleteAt": "2022-08-29T12:23:54.818Z",
    "isDelete": true,
    "filePath": "string"
  }

   constructor(private readonly httpClient: HttpClient) {
  }
  public getListDecide(params?: any): Observable<TypeData<Branch>> {
    return this.httpClient.get(`${_prefix}`, {}).pipe(
        map((Branch: TypeData<Branch>) => {
            return Branch;
        })
    );
  }
  public createDecide(Achievement: Achievement): Observable<Achievement | null> {
    return this.httpClient.post(`${_prefix}`, Achievement).pipe(
        map((Achievement: Achievement) => {
            return Achievement;
        })
    );
  }
  public deleteDecide(id: number): Observable<Achievement | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
        map((Achievement: Achievement) => {
            return Achievement;
        })
    );
  }
  public getDecideDetail(id: number): Observable<Achievement> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.get(url, {}).pipe(
            map((Achievement: Achievement) => {
                return Achievement;
            })
        );
    }
    getExcelReport(param: PageFilterDecide): Observable<{ dt: string }> {
        let url: string = `${_prefix}/export-excel-Achievement`;

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

}
