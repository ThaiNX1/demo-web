import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {TextGoModel} from "../../../../models/text-go.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TextGoService} from "../../../../service/text-go.service";
import {TranslateService} from "@ngx-translate/core";
import {DocumentTypeService} from "../../../../service/document-type.service";
import {UserService} from "../../../../service/user.service";
import {DepartmentService} from "../../../../service/department.service";
import {Page} from "../../../../models/common.model";
import {DocumentTypeModel} from "../../../../models/document-type.model";
import {User} from "../../../../models/user.model";
import {Department} from "../../../../models/department.model";
import {debounceTime, Subject} from "rxjs";
import AppUtil from "../../../../utilities/app-util";

@Component({
    selector: 'app-text-go-form',
    providers: [MessageService, ConfirmationService],
    templateUrl: './text-go-form.component.html',
    styleUrls: []
})
export class TextGoFormComponent implements OnInit {
    @Input() display = false

    @Input() set formData(value) {
        if (value?.id) {
            this.isEdit = true
            this.textGoModel = Object.assign(this.textGoModel, value)
        } else {
            this.isEdit = false
        }
    };

    @Output() onCancel = new EventEmitter()
    isEdit = false
    textGoModel: TextGoModel = {
        dateText: new Date(),
    }
    param: Page = {
        page: 1,
        pageSize: 20,
    }
    documentTypes: DocumentTypeModel[] = []
    users: User[] = []
    departments: Department[] = []
    drafters: User[] = []
    subjectDept = new Subject<string>()
    subjectUser = new Subject<string>()
    subjectDocumentType = new Subject<string>()
    subjectDrafter = new Subject<string>()

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private readonly messageService: MessageService,
        private readonly textGoService: TextGoService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly documentTypeService: DocumentTypeService,
        private readonly userService: UserService,
        private readonly departmentService: DepartmentService,
    ) {
    }

    ngOnInit(): void {
        this.getUsers()
        this.getDepartments()
        this.getDocumentTypes()
        this.subjectDept.pipe(debounceTime(500)).subscribe(value => {
            this.getDepartments(value)
        })
        this.subjectUser.pipe(debounceTime(500)).subscribe(value => {
            this.getUsers(value)
        })
        this.subjectDocumentType.pipe(debounceTime(500)).subscribe(value => {
            this.getDocumentTypes(value)
        })
    }

    getUsers(keyword?: string) {
        this.param.searchText = keyword || ''
        this.userService.getPagingUser(this.param).subscribe(res => {
            this.users = res?.data || []
        }, error => {
            this.users = []
        })
    }

    getDepartments(keyword?: string) {
        this.param.searchText = keyword || ''
        this.departmentService.getListDepartment(this.param).subscribe(res => {
            this.departments = res?.data || []
        }, error => {
            this.departments = []
        })
    }

    getDocumentTypes(keyword?: string) {
        this.param.searchText = keyword || ''
        this.documentTypeService.getPagingDocumentType(
            {
                ...this.param,
                page: (this.param.page - 1) < 0 ? 0 : (this.param.page - 1)
            }
        ).subscribe(res => {
            this.documentTypes = res?.data || []
        }, error => {
            this.documentTypes = []
        })
    }

    onFilterDepartment(event: any) {
        if (event)
            this.subjectDept.next(event.filter)
    }

    onFilterDocumentType(event: any) {
        if (event)
            this.subjectDocumentType.next(event.filter)
    }

    onFilterUser(event: any) {
        if (event)
            this.subjectUser.next(event.filter)
    }

    onUploadFile(event) {
        this.textGoModel.file = event.target?.files[0]
    }

    onSave() {
        if (this.isEdit)
            this.textGoService.updateTextGo(this.textGoModel, this.textGoModel.id).subscribe(res => {
                this.messageService.add({
                    severity: 'success',
                    detail: AppUtil.translate(this.translateService, 'success.update')
                })
                this.onCancel.emit({})
            }, err => {
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
            })
        else
            this.textGoService.createTextGo(this.textGoModel).subscribe(res => {
                this.messageService.add({
                    severity: 'success',
                    detail: AppUtil.translate(this.translateService, 'success.create')
                })
                this.onCancel.emit({})
            }, err => {
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
            })
    }

    onBack() {
        this.onCancel.emit({})
    }
}
