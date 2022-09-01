import {Component, OnInit} from '@angular/core';
import {Page, TypeData} from "../../../models/common.model";
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import AppUtil from "../../../utilities/app-util";
import {SliderService} from "../../../service/web-setting/slider.service";
import {SliderViewModel} from "../../../models/web-setting/slider.model";
import {LanguageType} from "../../../utilities/app-enum";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-slider-web',
    templateUrl: './slider-web.component.html',
    styles: [``],
})
export class SliderWebComponent implements OnInit {
    serverImage = `${environment.serverURLImage}/`
    display: boolean = false
    formData = {}
    loading: boolean = false
    result: TypeData<SliderViewModel> = {
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
        private readonly sliderService: SliderService,
    ) {
    }

    ngOnInit(): void {
        this.getSliders()
    }

    getSliders(event?: any) {
        if (event) {
            this.param.page = event.first / event.rows;
            this.param.pageSize = event.rows;
        }
        this.sliderService.getPagingSlider(this.param).subscribe(res => {
            AppUtil.scrollToTop()
            this.result = {
                ...res,
                data: res?.data?.map((item) => {
                    return {
                        id: item.id,
                        type: item.type,
                        typeName: item.type === LanguageType.ENGLISH ? 'Tiếng Anh' : (item.type === LanguageType.KOREA ? 'Tiếng Hàn' : 'Tiếng Việt'),
                        name: item.name,
                        image: item.image,
                        imageUrl: item.image ? (this.serverImage + item.image) : '',
                        createAt: item.createAt
                    }
                })
            }
        }, error => {
            this.messageService.add({severity: 'error', detail: 'Lỗi lấy dữ liệu'})
        })
    }

    onAddSlider() {
        this.display = true
        this.formData = {}
    }

    getSliderDetail(item) {
        this.display = true
        this.formData = item
    }

    onDeleteSlider(item) {
        let message;
        this.translateService
            .get('question.delete_web_slider_content')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.sliderService.deleteSlider(item?.id).subscribe(res => {
                    AppUtil.scrollToTop()
                    this.messageService.add({
                        severity: 'success',
                        detail: AppUtil.translate(this.translateService, 'success.delete')
                    })
                    this.getSliders()
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
        this.getSliders()
    }
}
