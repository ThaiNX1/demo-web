import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeData } from '../models/common.model';
import { Warehouse } from '../models/warehouse.model';
import AppConstant from '../utilities/app-constants';


@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    private readonly _baseUrl = AppConstant.DEFAULT_URLS.API;

    constructor(private readonly httpClient: HttpClient) {}

    public getWarehouse(params: any): Observable<TypeData<Warehouse>> {
        const url: string = this._baseUrl + '/warehouses';
        return this.httpClient.get(url, { params }).pipe(
            map((warehouse: TypeData<Warehouse>) => {
                return warehouse;
            })
        );
    }

    public getSelectList(): Observable<TypeData<Warehouse>> {
        const url: string = this._baseUrl + '/warehouses/getselectlist';
        return this.httpClient
            .post(url, {})
            .pipe(map((data) => data as TypeData<Warehouse>));
    }

    public getWarehouseWithID(id: number): Observable<Warehouse> {
        const url: string = this._baseUrl + `/warehouses/${id}`;
        return this.httpClient.post(url, {}).pipe(
            map((warehouse: Warehouse) => {
                return warehouse;
            })
        );
    }

    public createWarehouse(warehouse: Warehouse): Observable<Warehouse | null> {
        const url: string = this._baseUrl + '/warehouses/save';
        return this.httpClient.post(url, warehouse).pipe(
            map((warehouse: Warehouse) => {
                return warehouse;
            })
        );
    }

    public updateWarehouse(
        id: number,
        warehouse: Warehouse
    ): Observable<Warehouse> {
        const url: string = this._baseUrl + `/warehouses/save/${id}`;
        return this.httpClient.post(url, warehouse).pipe(
            map((warehouse: Warehouse) => {
                return warehouse;
            })
        );
    }

    public deleteWarehouse(id: number): Observable<Warehouse | null> {
        const url: string = this._baseUrl + `/warehouses/delete/${id}`;
        return this.httpClient.post(url, {}).pipe(
            map((warehouse: Warehouse) => {
                return warehouse;
            })
        );
    }
}
