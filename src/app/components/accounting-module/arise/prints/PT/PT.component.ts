import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/models/company.model';
import { AuthService } from '../../../../../core/services';
import { User } from '../../../../../shared/models/user.model';


@Component({
    selector: 'PT',
    templateUrl: './PT.component.html',
})
export class PTComponent implements OnInit {

    public currentUser: User | undefined;

    constructor(private authService: AuthService) {
        authService.currentUser
            .pipe()
            .subscribe((x) => {
                this.currentUser = x;
            });
    }

    @Input() company: Company;
    @Input() total: number;
    @Input() dataPrint: any;
    @Input() creditCodes = [];
    dateStr = '';
    order = '';
    orginalDescription = '';
    ngOnInit(): void {
console.log(this.company)
        let newDate = new Date(this.dataPrint.orginalBookDate);
        const day = newDate.getDate() < 10 ? '0' + newDate.getDate() : '' + newDate.getDate();
        const month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : '' + (newDate.getMonth() + 1);
        this.dateStr = `Ngày ${day} tháng ${month} năm ${newDate.getFullYear()}`;
        this.order = this.dataPrint.orginalVoucherNumber.split("/")[0];
        this.creditCodes.forEach((ele: any) =>{
if(this.orginalDescription.indexOf(ele.orginalDescription) < 0)
this.orginalDescription = this.orginalDescription + "; "+ ele.orginalDescription;
        })
    }
}
