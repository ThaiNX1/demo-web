import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    menuMode = 'static';
    latestEvent = 'randomLast';
    historicalEvent = 'randomHistory';

    constructor(
        private primengConfig: PrimeNGConfig,
        private translateService: TranslateService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        this.translateService
            .get('primeng')
            .subscribe((res) => this.primengConfig.setTranslation(res));
    }
}
