import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DecideService } from 'src/app/service/decide.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import * as moment from 'moment';

@Component({
  selector: 'app-achievement-form',
  templateUrl: './achievement-form.component.html',
  styles: [
      `
          :host ::ng-deep {
          }
      `,
  ],
})
export class AchievementFormComponent implements OnInit {
 public appConstant = AppConstant;
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();
  title: string = '';

  achievementForm: FormGroup = new FormGroup({});

  isSubmitted = false;
  isInvalidForm = false;
  failPassword: boolean = false;
  types:any[]=[{id:1, name:"Loại quyết định mới"},{id: 2,name: "ádasd"}];
  employees:any[] =[];
  decideTypes: any[] = [{"id":1,"name":"Loại quyết định mới","description":null,"status":true,"createAt":"2020-12-14T11:25:47.397","updateAt":"2020-12-14T13:59:12.187","deleteAt":null,"isDelete":false,"userCreated":665,"userUpdated":665},
                        {"id":2,"name":"ádasd","description":null,"status":true,"createAt":"2020-12-14T14:54:22.733","updateAt":"2020-12-14T14:54:22.733","deleteAt":null,"isDelete":false,"userCreated":665,"userUpdated":665}]

  constructor(
      private fb: FormBuilder,
      private translateService: TranslateService,
      private messageService: MessageService,
      private decideService: DecideService,
      private readonly userService: UserService,
      // private router: Router,
      // private route: ActivatedRoute
  ) {
      this.achievementForm = this.fb.group({
        id:[''],
        userId:['',[Validators.required]],
        description: ['',[Validators.required]],
        name:['',[Validators.required]],
        date:['',[Validators.required]],
        note:['',[Validators.required]],
        isDelete:[''],
        code:['',[Validators.required]],
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
      if (
          this.isEdit &&
          this.formData &&
          Object.keys(this.formData).length > 0
      ) {
          this.achievementForm.setValue({
              id: this.formData.id,
              code: this.formData.code,
              name: this.formData.name,
              managerName: this.formData.managerName,
          });
          console.log('this.achievementForm', this.achievementForm);
      }
  }

  onReset() {
      this.isInvalidForm = false;
      this.achievementForm.reset();
  }

  ngOnInit() {
    this.getAllUserActive();
  }

   getAllUserActive() {
        this.userService.getAllUserActive().subscribe((res: any) => {
            this.employees = res.data;
        });
    }

  checkValidValidator(fieldName: string) {
        return ((this.achievementForm.controls[fieldName].dirty ||
        this.achievementForm.controls[fieldName].touched) &&
        this.achievementForm.controls[fieldName].invalid) ||
        (this.isInvalidForm && this.achievementForm.controls[fieldName].invalid)
        ? 'ng-invalid ng-dirty'
        : '';
  }

  onSubmit() {
      this.isSubmitted = true;
      this.isInvalidForm = false;
      console.log(this.achievementForm.value);
      
      if (this.achievementForm.invalid) {
          this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(
                  this.translateService,
                  'info.please_check_again'
              ),
          });
          this.isInvalidForm = true;
          this.isSubmitted = false;
          return;
      }

      let newData = this.cleanObject(
          AppUtil.cleanObject(this.achievementForm.value)
      );
      this.onCancel.emit({});
      if (this.isEdit) {

        //   this.branchService
        //       .updateBranch(newData, this.achievementForm.value.id)
        //       .subscribe((res: any) => {
        //           if (res?.code === 400) {
        //               this.messageService.add({
        //                   severity: 'error',
        //                   detail: res?.msg || '',
        //               });
        //               return;
        //           } else {
        //               this.onCancel.emit({});
        //               this.messageService.add({
        //                   severity: 'success',
        //                   detail: 'Cập nhật thành công',
        //               });
        //           }
        //       });
      } else {
          this.decideService.createDecide(newData).subscribe(
              (res: any) => {
                  if (res?.code === 400) {
                      this.messageService.add({
                          severity: 'error',
                          detail: res?.msg || '',
                      });
                      return;
                  } else {
                      this.onCancel.emit({});
                      this.messageService.add({
                          severity: 'success',
                          detail: 'Thêm mới thành công',
                      });
                  }
              },
              (err) => {
                  console.log('err', err);
              }
          );
      }
  }

  onBack() {
      this.onCancel.emit({});
  }

  cleanObject(data) {
      let newData = Object.assign({}, data);
      if (!(newData.id > 0)) {
        newData.id = 0;
        newData.type = this.achievementForm.value.type.id;
        newData.employeesId =  this.achievementForm.value.employeesName.id;
        newData.employeesName = this.achievementForm.value.employeesName.fullName;
        newData.decideTypeId = this.achievementForm.value.decideTypeName.id;
        newData.decideTypeName =  this.achievementForm.value.decideTypeName.name;
        newData.date = moment(this.achievementForm.value.date).format("YYYY-MM-DD")  ;
        newData.description =this.achievementForm.value.description ;
        newData.note = this.achievementForm.value.note;
        newData.fileUrl = "";
        newData.file=null;
      }
      return newData;
  }

}
