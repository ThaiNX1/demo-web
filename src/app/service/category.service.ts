import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';
import { Page, TypeData } from '../models/common.model';
import { Category } from '../models/category.model';

export interface PageFilterCategory extends Page {
    type: number;
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Category`;

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private readonly httpClient: HttpClient) {}

    public getPaging(params): Observable<TypeData<Category>> {
        if(params.floorId === 0) {
            delete params.floorId;
        }
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((data: TypeData<Category>) => {
                return data;
            })
        );
    }
    public getAll(): Observable<TypeData<Category>> {
        return this.httpClient.get(`${_prefix}/list`).pipe(
            map((data: TypeData<Category>) => {
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

    public deleteCategory(id: number): Observable<any> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((res) => {
                return res;
            })
        );
    }
}
