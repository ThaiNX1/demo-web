import { environment } from "src/environments/environment";
import { AccountService } from "../service/account.service";

export function appInitializer(accountService: AccountService): any {
    console.log(accountService);
    const thisGlobal = accountService;
    return function () {
        console.log(thisGlobal);
        new Promise((resolve) => {
            // wait for facebook sdk to initialize before starting the angular app
            window['fbAsyncInit'] = function () {
                FB.init({
                    appId: environment.facebookAppId,
                    cookie: true,
                    xfbml: true,
                    version: 'v8.0',
                });

                console.log(thisGlobal);

                // auto authenticate with the api if already logged in with facebook
                FB.getLoginStatus(({ authResponse }) => {
                    console.log(authResponse);
                    // this.router.navigate(['/uikit/profile/my-profile']);
                    if (authResponse) {
                       console.log(thisGlobal);
                           thisGlobal.apiAuthenticate(authResponse.accessToken)
                           .subscribe(res => {
                                console.log(res);
                           });
                    } else {
                    }

                    // @ts-ignore
                    resolve();
                });
            };

            // load facebook sdk script
            (function (d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'facebook-jssdk');
        });
    };
}
