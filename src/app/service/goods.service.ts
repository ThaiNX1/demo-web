import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';
import { Page, TypeData } from '../models/common.model';
import { Goods } from '../models/goods.model';

export interface PageFilterGoods extends Page {
    floorId: number;
    isFloor: string;
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Goods`;

@Injectable({
    providedIn: 'root',
})
export class GoodsService {
    constructor(private readonly httpClient: HttpClient) {}

    public getList(params): Observable<TypeData<Goods>> {
        if(params.floorId === 0) {
            delete params.floorId;
        }
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((data: TypeData<Goods>) => {
                return data;
            })
        );
    }
    public getListNoQuery(): Observable<TypeData<Goods>> {
        return this.httpClient.get(`${_prefix}/getGoods`).pipe(
            map((data: TypeData<Goods>) => {
                return data;
            })
        );
    }

    public getDetail(id: number): Observable<any> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.get(url, {}).pipe(
            map((res) => {
                return res;
            })
        );
    }

    public create(body): Observable<any> {
        const url: string = `${_prefix}`;
        return this.httpClient.post(url, body).pipe(
            map((res) => {
                return res;
            })
        );
    }

    public update(body, id: number): Observable<any> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.put(url, body).pipe(
            map((res) => {
                return res;
            })
        );
    }

    public deleteGoods(id: number): Observable<any> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((res) => {
                return res;
            })
        );
    }
}
