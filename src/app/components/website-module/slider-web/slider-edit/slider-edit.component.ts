import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SliderModel, SliderViewModel} from "../../../../models/web-setting/slider.model";
import {LanguageType} from "../../../../utilities/app-enum";
import AppUtil from "../../../../utilities/app-util";
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {SliderService} from "../../../../service/web-setting/slider.service";

@Component({
    selector: 'app-slider-edit',
    templateUrl: './slider-edit.component.html',
    styleUrls: []
})
export class SliderEditComponent implements OnInit {
    @Input() display = false

    @Input() set formData(value) {
        if (value?.id) {
            this.isEdit = true
            this.sliderModel = Object.assign(this.sliderModel, value)
        } else {
            this.isEdit = false
        }
    };

    @Output() onCancel = new EventEmitter()
    isEdit = false
    sliderModel: SliderViewModel = {
        createAt: new Date(),
    }
    languageTypes = []

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly sliderService: SliderService,
    ) {
    }

    ngOnInit(): void {
        this.languageTypes = [
            {
                value: LanguageType.KOREA,
                name: 'Tiếng Hàn'
            },
            {
                value: LanguageType.ENGLISH,
                name: 'Tiếng Anh'
            },
            {
                value: LanguageType.VIETNAM,
                name: 'Tiếng Việt'
            },
        ]
    }

    onUploadFile(event) {
        const file = event.currentFiles[0]
        const formData = new FormData()
        formData.append('file', file)
        // this.userTaskCommentService.uploadFile(formData).subscribe((res) => {
        //     if (res) {
        //         this.fileUpload = res
        //         this.workflowModel.fileLink.push(res)
        //     }
        // }, err => {
        //     this.messageService.add({
        //         severity: 'error',
        //         detail: AppUtil.translate(this.translateService, 'error.0')
        //     })
        // })
    }

    onSave() {
        let requestModel: SliderModel = {}
        Object.assign(requestModel, this.sliderModel)
        if (requestModel.id) {
            this.sliderService.updateSlider(requestModel, requestModel.id).subscribe((res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        detail: AppUtil.translate(this.translateService, 'success.update')
                    })
                    this.onCancel.emit({})
                }
            }, err => {
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
            })
        } else {
            this.sliderService.createSlider(requestModel).subscribe((res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        detail: AppUtil.translate(this.translateService, 'success.create')
                    })
                    this.onCancel.emit({})
                }
            }, err => {
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
            })
        }
    }
}
