import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Document } from 'src/app/models/document.model';
import { DocumentService } from 'src/app/service/document.service';
import AppUtil from 'src/app/utilities/app-util';
// get the height
@Component({
    selector: 'app-arise-filter',
    templateUrl: './arise-filter.component.html',
    styles: [
        `
            :host ::ng-deep {
                .p-dropdown,
                .p-multiselect,
                .p-inputnumber,
                .p-inputnumber-input,
                p-inputMask .p-inputtext,
                .p-inputtext,
                .p-button,
                .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
                    height: 24px !important;
                }
                .p-dropdown-panel .p-dropdown-items .p-dropdown-item,
                .p-dropdown-panel
                    .p-dropdown-items:not(.p-dropdown-virtualscroll) {
                    padding-top: 6px !important;
                    padding-bottom: 2px !important;
                }
                p-inputMask .p-inputtext {
                    padding: 4px 0 0 4px !important;
                }
                .p-inputtext,
                .p-dropdown.p-dropdown-clearable .p-dropdown-label {
                    padding: 4px !important;
                }
                .p-dropdown .p-dropdown-trigger {
                    width: 2rem;
                }
            }
        `,
    ],
})
export class AriseFilterComponent implements OnInit {
    @Input('types') types: any = {};

    appUtil = AppUtil;
    @Input() filter = {
        keyword: null,
        documentType: null,
        documentMonth: new Date().getMonth() + 1,
        filterMonth: `${new Date().getMonth() + 1}`,
        payer: null,
        address: null,
        transferModelTypeData: 1,
        page: 0,
        pageSize: 20,
    };
    @Output() filterChange = new EventEmitter();
    documentList: Document[] = [];
    constructor(private readonly documentService: DocumentService) {}

    ngOnInit() {
        this.getDocumentTypeList();
    }
    getDocumentTypeList() {
        this.documentService
            .getDocuments({ page: 0, pagesize: 100 })
            .subscribe((resp) => {
                this.documentList = [...resp.data];
            });
    }
    search() {
        this.filterChange.emit(this.filter);
    }
    convertDateInString(crrDate: string | Date = new Date()) {
        crrDate = new Date(crrDate);
        return `${crrDate.getDate().toString().padStart(2, '0')}/${(
            crrDate.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}/${crrDate
            .getFullYear()
            .toString()
            .padStart(2, '0')}`;
    }
}
