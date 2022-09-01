import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Page, TypeData } from "../models/common.model";
import { TaxRates } from "../models/tax_rates.model";
import AppConstant from "../utilities/app-constants";

let _prefix = `${AppConstant.DEFAULT_URLS.API}/TaxRates`;

export interface PageFilterTaxRates extends Page {}

@Injectable({
    providedIn: 'root',
})
export class TaxRatesService {
    constructor(private readonly httpClient: HttpClient) {}

    public getListTaxRates(params: any): Observable<TypeData<TaxRates>> {
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((TaxRates: TypeData<TaxRates>) => {
                return TaxRates;
            })
        );
    }

    public getAllTaxRates(): Observable<TypeData<TaxRates>> {
        return this.httpClient.get(`${_prefix}/list`).pipe(
            map((TaxRates: TypeData<TaxRates>) => {
                return TaxRates;
            })
        );
    }

    public getTaxRatesByCode(code: string): Observable<TaxRates> {
        const url: string = `${_prefix}/get-by-code/${code}`;
        return this.httpClient.get(url, {}).pipe(
            map((TaxRates: TaxRates) => {
                return TaxRates;
            })
        );
    }

    public createTaxRates(TaxRates: TaxRates): Observable<TaxRates | null> {
        const url: string = `${_prefix}`;
        return this.httpClient.post(url, TaxRates).pipe(
            map((TaxRates: TaxRates) => {
                return TaxRates;
            })
        );
    }

    public updateTaxRates(
        TaxRates: TaxRates,
        id: number
    ): Observable<TaxRates> {
        console.log(TaxRates);
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.put(url, TaxRates).pipe(
            map((TaxRates: TaxRates) => {
                return TaxRates;
            })
        );
    }

    public deleteTaxRates(id: number): Observable<TaxRates | null> {
        const url: string = `${_prefix}/${id}`;
        return this.httpClient.delete(url, {}).pipe(
            map((TaxRates: TaxRates) => {
                return TaxRates;
            })
        );
    }
}
