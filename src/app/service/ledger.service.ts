import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeData } from '../models/common.model';
import { CustomActionResult } from '../models/custom-action-result.model';
import {
    FinalStandardDetailModel,
    FinalStandardToLedgerModel,
} from '../models/final-standard.model';
import { LedgerCostOfGoods } from '../models/ledger-cost-of-goods.model';
import { Ledger } from '../models/ledger.model';
import {
    LedgerSheetReportDto,
    RegisterReceiptSheetReportDto,
} from '../models/ledger-report.dto';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Ledgers`;

@Injectable({
    providedIn: 'root',
})
export class LedgerService {
    constructor(private readonly httpClient: HttpClient) {}
    private readonly _prefix = AppConstant.DEFAULT_URLS.API + "/Ledgers";

    public getList(params): Observable<TypeData<Ledger>> {
        return this.httpClient.get(`${_prefix}`, { params }).pipe(
            map((data: TypeData<Ledger>) => {
                return data;
            })
        );
    }

    public createLedger(
        ledger: Ledger
    ): Observable<CustomActionResult<Ledger>> {
        return this.httpClient.post(this._prefix, ledger).pipe(
            map(
                (response: CustomActionResult<Ledger>) => {
                    return response;
                },
                () => {}
            )
        );
    }

    public deleteLedger(params): Observable<CustomActionResult<Ledger>> {
        return this.httpClient.delete(this._prefix, { params }).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

}
