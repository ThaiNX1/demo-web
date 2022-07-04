import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, EMPTY } from 'rxjs';
import { map, concatMap, finalize } from 'rxjs/operators';
import { Account } from '../models/account';
import AppConstant from '../utilities/app-constants';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private readonly httpClient: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    facebookLogin() {
        // login with facebook and return observable with fb access token on success
        return from(
            new Promise<fb.StatusResponse>((resolve) => FB.login(resolve))
        ).pipe(
            concatMap(({ authResponse }) => {
                if (!authResponse) return EMPTY;
                return of(authResponse);
            })
        );
    }

    getAccountInfo(accessToken) {
        return this.httpClient
            .get(
                `https://graph.facebook.com/v8.0/me?access_token=${accessToken}`
            )
            .pipe(
                map((result: any) => {
                    return result;
                })
            );
    }

    apiAuthenticate(params: any) {
        // authenticate with the api using a facebook access token,
        // on success the api returns an account object with a JWT auth token
        return this.httpClient.post<any>(`${AppConstant.DEFAULT_URLS.API}/auth/login-web`, params)
            .pipe(
                map((account) => {
                    this.accountSubject.next(account);
                    this.startAuthenticateTimer();
                    return account;
                })
            );
    }

    logout() {
        // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
        FB.api('/me/permissions', 'delete', null, () => FB.logout());
        this.stopAuthenticateTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/login']);
    }

    // helper methods

    private authenticateTimeout;

    private startAuthenticateTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(
            atob(this.accountValue.token.split('.')[1])
        );

        // set a timeout to re-authenticate with the api one minute before the token expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60 * 1000;
        const { accessToken } = FB.getAuthResponse();
        this.authenticateTimeout = setTimeout(() => {
            console.log(accessToken);
        }, timeout);
    }

    private stopAuthenticateTimer() {
        // cancel timer for re-authenticating with the api
        clearTimeout(this.authenticateTimeout);
    }
}
