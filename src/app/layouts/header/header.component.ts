import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    zones = [
        {
            name: 'Miền bắc',
            code:1,
        },
        {
            name: 'Miền nam',
            code:2,
        },
    ]
    zoneId = 1

    constructor() {
    }

    ngOnInit(): void {
    }
    onClickZoneMenu(event){
       console.log('event',event.target.value)
    }
}
