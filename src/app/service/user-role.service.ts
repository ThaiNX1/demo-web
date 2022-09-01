import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';
import { UserRole } from '../models/user-role.model';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/UserRoles`;

@Injectable({
    providedIn: 'root',
})
export class UserRoleService {
    constructor(private readonly httpClient: HttpClient) {}

    public getAllUserRole(): Observable<TypeData<UserRole>> {
        return this.httpClient.get(`${_prefix}/list`).pipe(
            map((userRole: TypeData<UserRole>) => {
                return userRole;
            })
        );
    }
}
