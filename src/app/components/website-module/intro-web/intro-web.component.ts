import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {SliderService} from "../../../service/web-setting/slider.service";
import {environment} from "../../../../environments/environment";
import {Page, TypeData} from "../../../models/common.model";
import {SliderViewModel} from "../../../models/web-setting/slider.model";
import {IntroduceModel, IntroduceType} from "../../../models/web-setting/introduce.model";
import {IntroduceService} from "../../../service/web-setting/introduce.service";
import AppUtil from "../../../utilities/app-util";
import {LanguageType} from "../../../utilities/app-enum";

@Component({
    selector: 'app-intro-web',
    templateUrl: './intro-web.component.html',
    styles: [``],
})
export class IntroWebComponent implements OnInit {
    serverImage = `${environment.serverURLImage}/`
    display: boolean = false
    formData = {}
    loading: boolean = false
    result: TypeData<IntroduceModel> = {
        data: [],
        currentPage: 0,
        nextStt: 0,
        pageSize: 20,
        totalItems: 0
    }
    param: Page = {
        page: 1,
        pageSize: 20,
    }

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly introduceService: IntroduceService,
    ) {
    }

    ngOnInit(): void {
    }

    getIntroduces(event?: any) {
        if (event) {
            this.param.page = event.first / event.rows;
            this.param.pageSize = event.rows;
        }
        this.introduceService.getPagingIntroduce(this.param).subscribe((res) => {
            AppUtil.scrollToTop()
            this.result = {
                ...res,
                data: res?.data?.map((item) => {
                    return {
                        ...item,
                        typeName: item.type === LanguageType.ENGLISH ? 'Tiếng Anh' : (item.type === LanguageType.KOREA ? 'Tiếng Hàn' : 'Tiếng Việt'),
                        introduceTypeName: this.getIntroduceTypeName(item.introduceType)
                    }
                })
            }
        }, error => {
            this.messageService.add({severity: 'error', detail: 'Lỗi lấy dữ liệu'})
        })
    }

    onAddIntroduce() {
        this.display = true
        this.formData = {}
    }

    getIntroduceDetail(item) {
        this.display = true
        this.formData = item
    }

    onDeleteIntroduce(item) {
        let message;
        this.translateService
            .get('question.delete_web_introduce_content')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.introduceService.deleteIntroduce(item?.id).subscribe(res => {
                    AppUtil.scrollToTop()
                    this.messageService.add({
                        severity: 'success',
                        detail: AppUtil.translate(this.translateService, 'success.delete')
                    })
                    this.getIntroduces()
                }, error => {
                    this.messageService.add({
                        severity: 'error',
                        detail: AppUtil.translate(this.translateService, 'error.0')
                    })
                })
            },
        });

    }

    onCancelForm(event) {
        this.display = false
        this.formData = {}
        this.getIntroduces()
    }

    getIntroduceTypeName(introduceType): string {
        let introduceTypeName = ''
        switch (introduceType) {
            case IntroduceType.Post:
                introduceType = 'Bài viết'
                break
            case IntroduceType.Leader:
                introduceType = 'Lãnh đạo'
                break
            case IntroduceType.PaymentType:
                introduceType = 'Phương thức thanh toán'
                break
            case IntroduceType.Warranty:
                introduceType = 'Bảo hành'
                break
            case IntroduceType.Return:
                introduceType = 'Đổi trả'
                break
            case IntroduceType.Support:
                introduceType = 'Trung tâm hỗ trợ'
                break
            case IntroduceType.Transport:
                introduceType = 'Vận chuyển'
                break
            case IntroduceType.Policy:
                introduceType = 'Chính sách'
                break
        }
        return introduceTypeName
    }
}
