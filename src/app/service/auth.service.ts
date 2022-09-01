import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Auth, AuthData } from '../models/auth.model';
import { TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/auth`;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    initialAuthenticated = new BehaviorSubject('Initial Authenticated');

    constructor(private http: HttpClient, private router: Router) {}

    public setToken(token: string): void {
        localStorage.setItem(AppConstant.STORAGE_KEYS.SESSION, token);
    }

    public get token(): string | null {
        return localStorage.getItem(AppConstant.STORAGE_KEYS.SESSION);
    }

    public deleteToken(): void {
        localStorage.removeItem(AppConstant.STORAGE_KEYS.SESSION);
        localStorage.removeItem(AppConstant.STORAGE_KEYS.USER);
    }

    public clearSession(): void {
        this.deleteToken();
        localStorage.clear();
    }

    public setUser(authUser: AuthData | undefined): void {
        localStorage.setItem(
            AppConstant.STORAGE_KEYS.USER,
            JSON.stringify(authUser)
        );
    }

    public get user(): AuthData | null {
        return JSON.parse(localStorage.getItem(AppConstant.STORAGE_KEYS.USER));
    }

    public deleteUser(): void {
        localStorage.removeItem(AppConstant.STORAGE_KEYS.USER);
    }

    login(params: any): Observable<TypeData<Auth>> {
        return this.http.post<TypeData<Auth>>(`${_prefix}/login`, params).pipe(
            map((result) => {
                return result;
            })
        );
    }

    changePassword(params: any): Observable<any> {
        return this.http.post<any>(`${_prefix}/change-password`, params).pipe(
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

    public getListRole(): Observable<TypeData<any>> {
        return this.http.get(`${_prefix}/get-list-role`).pipe(
            map((role: TypeData<any>) => {
                return role;
            })
        );
    }
}

