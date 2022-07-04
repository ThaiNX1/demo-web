import {TranslateService} from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import {Observable} from "rxjs";
import * as CountryList from "countries-list";
import {map} from "rxjs/operators";
import AppConstant from "./app-constants";
import * as moment from 'moment';

const AppUtil = {
    setStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    },
    getStorage(key: string): string {
        return localStorage.getItem(key);
    },
    removeStorage(key: string): void {
        localStorage.removeItem(key);
    },
    clearStorageAll(): void {
        localStorage.clear();
    },
    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    toCamelCaseKey({ obj }: { obj: any }): any {
        if (Array.isArray(obj)) {
            return obj.map((v) => AppUtil.toCamelCaseKey({ obj: v }));
        } else if (obj && obj.constructor === Object) {
            return Object.keys(obj).reduce(
                (result, key) => ({
                    ...result,
                    [_.camelCase(key)]: AppUtil.toCamelCaseKey({
                        obj: obj[key],
                    }),
                }),
                {}
            );
        }
        return obj;
    },
    toSnakeCaseKey(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((v) => AppUtil.toSnakeCaseKey(v));
        } else if (obj && obj.constructor === Object) {
            return Object.keys(obj).reduce(
                (result, key) => ({
                    ...result,
                    [_.snakeCase(key)]: AppUtil.toSnakeCaseKey(obj[key]),
                }),
                {}
            );
        }
        return obj;
    },
    translateWithParams(
        service: TranslateService,
        key: any,
        params: any
    ): string {
        if (key && key === '') {
            return 'N/A';
        }
        let translateTxt = '';
        service.get(key, params).subscribe((res: string) => {
            translateTxt = res;
        });
        return translateTxt;
    },
    translate(service: TranslateService, key: string): string {
        if (!service || !key) {
            return '';
        }
        let translated = '';
        service.get(key).subscribe((s: string) => {
            console.log(translated);
            translated = s;
        });
        console.log(translated);
        return translated;
    },
    translateList: function (
        service: TranslateService,
        keys: string[],
        object: Object | undefined
    ): Observable<any> {
        return service.get(keys, object);
    },
    getBrowserLang() {
        return navigator.language || window.navigator.language;
    },
    hashMD5(text: string | CryptoJS.lib.WordArray): string {
        return CryptoJS.MD5(text).toString();
    },
    getCountries() {
        let countryCodes = [];
        for (const key of Object.keys(CountryList.countries)) {
            const country = this.getCountry(key);
            if (country.phone.length < 3) {
                let countryCode = {
                    code: key,
                    prefix: '+' + country.phone,
                    countryCode: country.phone,
                };
                countryCodes.push(countryCode);
            }
        }
        return countryCodes;
    },
    getCountry(code: string): any {
        if (!code) {
            return;
        }
        // @ts-ignore
        return CountryList.countries[code.toUpperCase()];
    },
    convertDateTimeKr(date: string, downline: boolean) {
        if (!date) return '';
        let momentDate = moment(date);
        let dateKr = ['일', '월', '화', '수', '목', '금', '토'];
        let typeTime = momentDate.format('A') === 'AM' ? '오전' : '오후';
        if (!downline) {
            return `${momentDate.format('YY.MM.DD')} (${
                dateKr[parseInt(momentDate.format('d'))]
            }) ${typeTime} ${momentDate.format('HH:mm')}`;
        }
        return `${momentDate.format('YY.MM.DD')} (${
            dateKr[parseInt(momentDate.format('d'))]
        })<br/>${typeTime} ${momentDate.format('HH:mm')}`;
    },
    formatMoney(
        amount: string | number = 0,
        decimalCount = 2,
        decimal = '.',
        thousands = ','
    ): any {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? '-' : '';

            let i = parseInt(
                (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
            ).toString();
            let j = i.length > 3 ? i.length % 3 : 0;

            return (
                negativeSign +
                (j ? i.substr(0, j) + thousands : '') +
                i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
                (decimalCount
                    ? decimal +
                      // @ts-ignore
                      Math.abs(amount - i)
                          .toFixed(decimalCount)
                          .slice(2)
                    : '')
            );
        } catch (e) {
            // console.log(e);
        }
    },
    formatDateTimeDay(
        dateTime: string,
        service: TranslateService,
        formatDate = 'YYYY.MM.DD',
        formatTime = 'HH:mm'
    ) {
        let dateFormat = moment(dateTime).format(formatDate);
        dateFormat += '(';
        let dayOfWeek = new Date(dateTime).getDay();
        dateFormat +=
            this.translate(service, 'primeng.dayNamesShort')[dayOfWeek] + ') ';
        dateFormat += moment(dateTime).format(formatTime);
        return dateFormat;
    },
    cleanObject(data) {
        let newData = Object.assign({}, data);
        for (var name in newData) {
            if (
                newData.hasOwnProperty(name) &&
                newData[name] === undefined &&
                newData[name] !== '0'
            ) {
                console.log(name, typeof newData[name]);
                delete newData[name];
            }
        }
        return newData;
    },
    getJobTypes(translateService: TranslateService): any {
        return this.translateList(
            translateService,
            [
                'label.job_type_1',
                'label.job_type_2',
                'label.job_type_3',
                'label.job_type_4',
            ],
            {}
        ).pipe(
            map((trans) => {
                let results = [];
                for (let i = 1; i <= 4; i++) {
                    results.push({
                        code: i - 1,
                        label: trans[`label.job_type_${i}`],
                    });
                }

                return results;
            })
        );
    },
};

export default AppUtil;
