import {Component, OnInit} from '@angular/core';
import {Page, TypeData} from "../../../models/common.model";
import {TextGoModel} from "../../../models/text-go.model";
import {ConfirmationService, MessageService} from "primeng/api";
import {IncomingTextService} from "../../../service/incoming-text.service";
import {TranslateService} from "@ngx-translate/core";
import AppUtil from "../../../utilities/app-util";
import {TextGoService} from "../../../service/text-go.service";
import {Router} from "@angular/router";
import {IncomingTextModel} from "../../../models/incoming-text.model";
import {AuthService} from "../../../service/auth.service";

@Component({
    selector: 'app-text-go',
    providers: [MessageService, ConfirmationService],
    templateUrl: './text-go.component.html',
    styles: [``],
})
export class TextGoComponent implements OnInit {
    display: boolean = false;
    formData = {}
    displayWorkflowForm = false
    formDataWorkflow = {}
    loading: boolean = false;
    sortFields: any[] = [];
    sortTypes: any[] = [];
    result: TypeData<TextGoModel> = {
        data: [],
        currentPage: 0,
        nextStt: 0,
        pageSize: 20,
        totalItems: 0
    }
    param: Page = {
        page: 0,
        pageSize: 20,
    }

    constructor(
        private readonly messageService: MessageService,
        private readonly textGoService: TextGoService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.getTextGo()
    }

    getTextGo(event?: any) {
        if (event) {
            this.param.page = event.first / event.rows;
            this.param.pageSize = event.rows;
        }
        this.textGoService.getPagingTextGo(this.param).subscribe(res => {
            AppUtil.scrollToTop()
            this.result = res
        }, error => {
            this.messageService.add({severity: 'error', detail: 'Lỗi lấy dữ liệu'})
        })
    }

    onAddTextGo() {
        this.display = true
        this.formData = {}
    }

    getTextGoDetail(item) {
        this.display = true
        this.formData = item
    }

    onDeleteTextGo(id) {
        let message;
        this.translateService
            .get('question.delete_text_go_content')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.textGoService.deleteTextGo(id).subscribe(res => {
                    AppUtil.scrollToTop()
                    this.messageService.add({
                        severity: 'success',
                        detail: AppUtil.translate(this.translateService, 'success.delete')
                    })
                }, error => {
                    this.messageService.add({
                        severity: 'error',
                        detail: AppUtil.translate(this.translateService, 'error.0')
                    })
                })
            },
        });

    }

    onChangeSort(event, type) {
    }

    onCreateWorkflow(item: TextGoModel) {
        this.formDataWorkflow = {
            name: item.documentName,
            description: item.content,
            dueDate: null,
            userCreateName: this.authService.user.fullname,
            responsiblePerson: [],
            joinedPersons: [],
            viewedPersons: [],
            fileLink: [{
                fileId: '',
                fileName: item.fileUrl
            }]
        }
        this.displayWorkflowForm = true
    }

    onCancelForm(event) {
        this.display = false
        this.formData = {}
        this.displayWorkflowForm = false
        this.formDataWorkflow = {}
        this.getTextGo()
    }
}
