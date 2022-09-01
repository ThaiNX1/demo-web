import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {
    UserTaskCommentModel,
    UserTaskFileModel,
    UserTaskModel,
    UserTaskModeList, UserTaskRoleDetailsModel
} from "../../../../models/workflow.model";
import {addDays} from "date-fns";
import {UserService} from "../../../../service/user.service";
import {DepartmentService} from "../../../../service/department.service";
import {AuthService} from "../../../../service/auth.service";
import {User} from "../../../../models/user.model";
import {Department} from "../../../../models/department.model";
import {debounceTime, Subject} from "rxjs";
import {WorkflowService} from "../../../../service/workflow.service";
import {UserTaskRole, UserTaskStatus} from "../../../../utilities/app-enum";
import AppUtil from "../../../../utilities/app-util";
import {TranslateService} from "@ngx-translate/core";
import {UserTaskCommentService} from "../../../../service/user-task-comment.service";
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from "../../../../../environments/environment";

@Component({
    providers: [MessageService, ConfirmationService],
    selector: 'app-workflow-form',
    templateUrl: './workflow-form.component.html',
    styleUrls: ['./workflow-form.component.scss'],
})
export class WorkflowFormComponent implements OnInit {
    @Input() display = false

    @Input() set formData(value) {
        if (value?.id) {
            this.isEdit = true
            this.workflowModel = {
                ...value,
                fileLink: value?.fileLink || []
            }
            this.onGetComments(value.id)
            this.isAddComment = false
            this.newComment = ''
        } else {
            this.comments = []
            this.isEdit = false
            this.workflowModel = {
                id: 0,
                dueDate: null,
                responsiblePerson: [],
                userCreateName: this.authService.user?.fullname,
                joinedPersons: [],
                viewedPersons: [],
                checkList: [],
                fileLink: []
            }
        }
    };

    @Output() onCancel = new EventEmitter()
    serverImage = environment.serverURLImage + '/'
    workflowModel: any = {}
    itemCheckList = '';
    isEdit = false
    users: User[] = []
    departments: Department[] = []
    subjectDept = new Subject<string>()
    subjectUser = new Subject<string>()
    parentProjects: UserTaskModeList[] = []

    userTypeOptions = [
        {
            name: 'Tạo bởi',
            value: 1
        },
        {
            name: 'Tham gia',
            value: 2
        },
        {
            name: 'Quan sát',
            value: 3
        },
    ]
    viewTypes = [
        {
            name: 'Toàn công ty',
            value: true,
        },
        {
            name: 'Những cá nhân liên quan',
            value: false,
        },
    ]
    userTypesSelected: any
    fileUpload: UserTaskFileModel
    comments: UserTaskCommentModel[] = []
    isAddComment = false
    newComment = ''
    newCommentImage = []

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly userService: UserService,
        private readonly departmentService: DepartmentService,
        private readonly authService: AuthService,
        private readonly workflowService: WorkflowService,
        private readonly userTaskCommentService: UserTaskCommentService,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit(): void {
        this.getUsers()
        this.getDepartments()
        this.getParentList()
        this.subjectDept.pipe(debounceTime(500)).subscribe(value => {
            this.getDepartments(value)
        })
        this.subjectUser.pipe(debounceTime(500)).subscribe(value => {
            this.getUsers(value)
        })
        this.workflowModel = {
            ...this.workflowModel,
            userCreateName: this.authService.user.fullname
        }
    }

    onChangeSelected(event) {
    }

    onBack() {
        this.router.navigate(['/uikit/workflow'])
    }

    onAddCheckList() {
        if (this.itemCheckList?.trim()?.length > 0) {
            this.workflowModel.checkList.push({
                id: 0,
                userTaskId: 0,
                fileLink: '',
                name: this.itemCheckList,
                status: false
            })
            this.itemCheckList = ''
        }
    }

    removeChecklist(item) {
        const indexItem = this.workflowModel?.checkList?.indexOf(item)
        this.workflowModel?.checkList?.splice(indexItem, 1)
    }

    getUsers(keyword?: string) {
        const param = {
            page: 1,
            pageSize: 20,
            searchText: keyword || ''
        }
        this.userService.getPagingUser(param).subscribe(res => {
            this.users = res?.data?.map((user) => {
                return {
                    ...user,
                    avatar: this.serverImage + user.avatar
                }
            }) || []
        }, error => {
            this.users = []
        })
    }

    getDepartments(keyword?: string) {
        const param = {
            page: 1,
            pageSize: 20,
            searchText: keyword || ''
        }
        this.departmentService.getListDepartment(param).subscribe(res => {
            this.departments = res?.data || []
        }, error => {
            this.departments = []
        })
    }

    onFilterDepartment(event: any) {
        if (event)
            this.subjectDept.next(event.filter)
    }

    onFilterUser(event: any) {
        if (event)
            this.subjectUser.next(event.filter)
    }

    getParentList(keyword?: string) {
        this.workflowService.getParentList().subscribe(res => {
            this.parentProjects = res || []
        }, error => {
            this.departments = []
        })
    }

    onSave() {
        const taskRoles = [
            ...this.workflowModel?.responsiblePerson?.map(person => {
                return {
                    id: 0,
                    userTaskId: this.workflowModel?.id || 0,
                    userTaskRoleId: UserTaskRole.RESPONSIBLE,
                    userId: person?.id,
                }
            }),
            ...this.workflowModel?.joinedPersons?.map(person => {
                return {
                    id: 0,
                    userTaskId: this.workflowModel?.id || 0,
                    userTaskRoleId: UserTaskRole.JOINED,
                    userId: person?.id
                }
            }),
            ...this.workflowModel?.viewedPersons?.map(person => {
                return {
                    id: 0,
                    userTaskId: this.workflowModel?.id || 0,
                    userTaskRoleId: UserTaskRole.VIEWER,
                    userId: person?.id
                }
            }),
        ]
        delete this.workflowModel.responsiblePerson
        delete this.workflowModel.joinedPersons
        delete this.workflowModel.viewedPersons
        delete this.workflowModel.userCreateName
        if (!this.workflowModel?.id) {
            const request: UserTaskModel = {
                ...this.workflowModel,
                userCreated: this.authService.user?.id,
                createdDate: new Date(),
                status: UserTaskStatus.OPENING,
                isDeleted: false,
                taskRole: taskRoles,
                childTask: null,
                fileLink: null
            }
            this.workflowService.add(request).subscribe((res) => {
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
        } else {
            const request: UserTaskModel = {
                ...this.workflowModel,
                isDeleted: false,
                taskRole: taskRoles,
                childTask: null,
                fileLink: null
            }
            this.workflowService.update(this.workflowModel.id, request).subscribe((res) => {
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
        }
    }

    onAddComment() {
        if (this.newCommentImage?.length) {
            this.newCommentImage?.map((cmtImg) => {
                this.newComment.replace(cmtImg.oldText, cmtImg.newLink)
            })
        }
        this.userTaskCommentService.add({
            id: 0,
            userTaskId: this.workflowModel.id,
            userId: this.authService.user.id,
            type: 'edit',
            comment: this.newComment,
            parentId: 0,
            createdDate: new Date(),
            fileLink: [],
            nameOfUser: this.authService.user.fullname,
            isAllowEdit: true,
            taskRole: []
        }).subscribe((res) => {
            if (res) {
                this.isAddComment = false
                this.newComment = ''
                this.onGetComments(this.workflowModel.id)
            }
        }, err => {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(this.translateService, 'error.0')
            })
        })
    }

    onGetComments(taskId) {
        this.userTaskCommentService.getByTask({id: taskId}).subscribe((res) => {
            this.comments = res?.map((cmt) => {
                return {
                    ...cmt,
                    commentHTML: this.sanitizer.bypassSecurityTrustHtml(cmt.comment || '')
                }
            })
        }, err => {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(this.translateService, 'error.0')
            })
        })
    }

    onUploadFile(event) {
        const file = event.currentFiles[0]
        const formData = new FormData()
        formData.append('file', file)
        this.userTaskCommentService.uploadFile(formData).subscribe((res) => {
            if (res) {
                this.fileUpload = res
                this.workflowModel.fileLink.push(res)
            }
        }, err => {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(this.translateService, 'error.0')
            })
        })
    }

    onChangeEditor(event) {
        this.newComment = event.htmlValue
        event?.delta?.ops?.map((item) => {
            if (item?.insert?.image) {
                const image = item?.insert?.image
                const formData = new FormData()
                formData.append('file', new Blob([image.split(',')[1]], {type: 'image/png'}))
                this.userTaskCommentService.uploadFile(formData).subscribe((res) => {
                    if (res) {
                        this.newCommentImage.push({
                            oldText: image,
                            newLink: this.serverImage + res.fileName
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
}
