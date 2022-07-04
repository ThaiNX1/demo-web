import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import AppConstant from '../utilities/app-constants';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { TypeData } from '../models/common.model';
import { Auth, AuthData } from '../models/auth.model';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/auth`;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    initialAuthenticated = new BehaviorSubject('Initial Authenticated');

    authUserOj: AuthData | undefined;

    constructor(private http: HttpClient, private router: Router) {}

    public setToken(token: string): void {
        localStorage.setItem(AppConstant.STORAGE_KEYS.SESSION, token);
    }

    public get token(): string | null {
        return localStorage.getItem(AppConstant.STORAGE_KEYS.SESSION);
    }

    public deleteToken(): void {
        localStorage.removeItem(AppConstant.STORAGE_KEYS.SESSION);
    }

    public clearSession(): void {
        this.setAuthUser(undefined);
        this.deleteToken();
        localStorage.clear();
    }

    public get authUser(): AuthData | undefined {
        return this.authUserOj;
    }

    public setAuthUser(authUserOj: AuthData | undefined): void {
        this.authUserOj = authUserOj;
    }

    login(params: any): Observable<TypeData<Auth>> {
        return this.http.post<TypeData<Auth>>(`${_prefix}/login-web`, params).pipe(
            map((result) => {
                return result;
            })
        );
    }

    registUser(params: any): Observable<TypeData<Auth>> {
        return this.http.post<TypeData<Auth>>(`${_prefix}/register-user-web`, params).pipe(
            map((result) => {
                return result;
            })
        );
    }

    resetPassword(params: any): Observable<any> {
        return this.http
            .post<TypeData<Auth>>(`${_prefix}/requestForgotPass`, params)
            .pipe(
                map((result) => {
                    return result;
                })
            );
    }

    initAuthenticated(): void {
        this.initialAuthenticated.next('initial authenticated');
    }
}

