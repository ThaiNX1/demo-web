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
  selector: 'app-decide-form',
  templateUrl: './decide-form.component.html',
   styles: [
        `
            :host ::ng-deep {
            }
        `,
    ],
})
export class DecideFormComponent implements OnInit {

 public appConstant = AppConstant;
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();
  title: string = '';

  decideForm: FormGroup = new FormGroup({});

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
      this.decideForm = this.fb.group({
        id:[''],
        type:['',[Validators.required]],
        employeesName: ['',[Validators.required]],
        decideTypeName:['',[Validators.required]],
        date:['',[Validators.required]],
        description:['',[Validators.required]],
        note:['',[Validators.required]],
        fileUrl:[''],
        file:['']
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
      if (
          this.isEdit &&
          this.formData &&
          Object.keys(this.formData).length > 0
      ) {
          this.decideForm.setValue({
              id: this.formData.id,
              code: this.formData.code,
              name: this.formData.name,
              managerName: this.formData.managerName,
          });
          console.log('this.decideForm', this.decideForm);
      }
  }

  onReset() {
      this.isInvalidForm = false;
      this.decideForm.reset();
  }

  ngOnInit() {
    this.getListTypes();
    this.getAllUserActive();
  }

  getListTypes(){
    // this.decideService.getSelectList().subscribe(data =>{
    //     this.decideTypes = data.data;
    // })
  }
   getAllUserActive() {
        this.userService.getAllUserActive().subscribe((res: any) => {
            this.employees = res.data;
            console.log(this.employees);
            
        });
    }

  checkValidValidator(fieldName: string) {
        return ((this.decideForm.controls[fieldName].dirty ||
        this.decideForm.controls[fieldName].touched) &&
        this.decideForm.controls[fieldName].invalid) ||
        (this.isInvalidForm && this.decideForm.controls[fieldName].invalid)
        ? 'ng-invalid ng-dirty'
        : '';
  }

  onSubmit() {
      this.isSubmitted = true;
      this.isInvalidForm = false;
      console.log(this.decideForm.value);
      
      if (this.decideForm.invalid) {
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
          AppUtil.cleanObject(this.decideForm.value)
      );
      this.onCancel.emit({});
      if (this.isEdit) {

        //   this.branchService
        //       .updateBranch(newData, this.decideForm.value.id)
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
        newData.type = this.decideForm.value.type.id;
        newData.employeesId =  this.decideForm.value.employeesName.id;
        newData.employeesName = this.decideForm.value.employeesName.fullName;
        newData.decideTypeId = this.decideForm.value.decideTypeName.id;
        newData.decideTypeName =  this.decideForm.value.decideTypeName.name;
        newData.date = moment(this.decideForm.value.date).format("YYYY-MM-DD")  ;
        newData.description =this.decideForm.value.description ;
        newData.note = this.decideForm.value.note;
        newData.fileUrl = "";
        newData.file=null;
      }
      console.log(newData);
      
      return newData;
  }

}
