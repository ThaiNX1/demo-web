import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SliderModel, SliderViewModel} from "../../../../models/web-setting/slider.model";
import {IntroduceModel, IntroduceType} from "../../../../models/web-setting/introduce.model";
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {SliderService} from "../../../../service/web-setting/slider.service";
import {IntroduceService} from "../../../../service/web-setting/introduce.service";
import {LanguageType} from "../../../../utilities/app-enum";
import AppUtil from "../../../../utilities/app-util";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-introduce-edit',
    templateUrl: './introduce-edit.component.html',
    styleUrls: []
})
export class IntroduceEditComponent implements OnInit {
    @Input() display = false

    @Input() set formData(value) {
        if (value?.id) {
            this.isEdit = true
            this.introduceModel = Object.assign(this.introduceModel, value)
        } else {
            this.isEdit = false
        }
    };

    @Output() onCancel = new EventEmitter()
    serverImg = environment.serverURLImage
    isEdit = false
    introduceModel: IntroduceModel = {}
    languageTypes = []
    introduceTypes = []
    content = ''
    newContentImages = []

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly introduceService: IntroduceService,
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
        this.introduceTypes = [
            {
                value:IntroduceType.Post,
                name:'Bài viết'
            },
            {
                value:IntroduceType.Leader,
                name:'Lãnh đạo'
            },
            {
                value:IntroduceType.PaymentType,
                name:'Phương thức thanh toán'
            },
            {
                value:IntroduceType.Warranty,
                name:'Bảo hành'
            },
            {
                value:IntroduceType.Return,
                name:'Đổi trả'
            },
            {
                value:IntroduceType.Support,
                name:'Trung tâm hỗ trợ'
            },
            {
                value:IntroduceType.Transport,
                name:'Vận chuyển'
            },
            {
                value:IntroduceType.Policy,
                name:'Chính sách'
            },
        ]
    }

    onChangeEditor(event) {
        this.content = event.htmlValue
        event?.delta?.ops?.map((item) => {
            if (item?.insert?.image) {
                const image = item?.insert?.image
                const formData = new FormData()
                formData.append('file', new Blob([image.split(',')[1]], {type: 'image/png'}))
                this.introduceService.uploadFile(formData).subscribe((res) => {
                    if (res) {
                        this.newContentImages.push({
                            oldText: image,
                            newLink: this.serverImg + res.fileName
                        })
                    }
                }, err => {
                    this.messageService.add({
                        severity: 'error',
                        detail: AppUtil.translate(this.translateService, 'error.0')
                    })
                })
            }
        })
    }

    onSave() {
        if (this.newContentImages?.length) {
            this.newContentImages?.map((cmtImg) => {
                this.content.replace(cmtImg.oldText, cmtImg.newLink)
            })
        }
        if (this.introduceModel.id) {
            this.introduceService.updateIntroduce(this.introduceModel, this.introduceModel.id).subscribe((res) => {
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
            this.introduceService.createIntroduce(this.introduceModel).subscribe((res) => {
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
