import {
    AfterViewInit, Component, HostListener, Inject, OnChanges, OnInit, SimpleChanges,
    ViewChild
} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {TypeData} from "../../../models/common.model";
import {ExpiredModel, KanbanModel, UserTaskModeList, UserTaskRequestModel} from "../../../models/workflow.model";
import {Router} from "@angular/router";
import {Calendar, CalendarOptions, FullCalendarComponent} from "@fullcalendar/angular";
import {
    addDays,
    addHours,
    addWeeks,
    compareAsc,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    startOfDay,
    startOfWeek
} from 'date-fns';
import {WorkflowService} from "../../../service/workflow.service";
import {DepartmentService} from "../../../service/department.service";
import {UserService} from "../../../service/user.service";
import {Department} from "../../../models/department.model";
import {debounceTime, Subject} from "rxjs";
import {UserTaskRole, UserTaskStatus} from "../../../utilities/app-enum";
import * as _ from 'lodash'
import AppUtil from "../../../utilities/app-util";
import {TranslateService} from "@ngx-translate/core";
import {saveAs} from 'file-saver';
import {environment} from "../../../../environments/environment";
import {DOCUMENT} from '@angular/common';
import {IsTableComponent} from "../../../shared/is-table/is-table.component";

@Component({
    selector: 'app-workflow',
    templateUrl: './workflow.component.html',
    styles: [`
        .item-panel:hover {
            background-color: var(--surface-100);
        }
    `
    ],
})
export class WorkflowComponent implements OnInit, AfterViewInit {
    display: boolean = false;
    formData = {}
    @ViewChild('op', {static: false}) overlayPanel: any;
    serverImg = environment.serverURLImage + '/'
    UserTaskStatusEnum = UserTaskStatus
    items: MenuItem[] = [
        {
            id: '1',
            label: 'Danh sách',
            icon: 'pi pi-fw pi-book',
            command: (event) => {
                this.activeItem = event.item
                this.getWorkList()
            }
        },
        {
            id: '2',
            label: 'Hạn chót',
            icon: 'pi pi-fw pi-clock',
            command: (event) => {
                this.activeItem = event.item
                this.getWorkListExpired()
            }
        },
        {
            id: '3',
            label: 'Lịch',
            icon: 'pi pi-fw pi-calendar',
            command: (event) => {
                this.activeItem = event.item
                this.getWorkListCalendar()
            }
        },
        {
            id: '4',
            label: 'Kanban',
            icon: 'pi pi-fw pi-chart-line',
            command: (event) => {
                this.activeItem = event.item
                this.getWorkListKanban()
            }
        },
    ];
    activeItem: MenuItem
    actions = [
        {id: 1, name: 'Ghim'},
        {id: 2, name: 'Hoàn thành'},
        {id: 3, name: 'Bắt đầu công việc'},
        {id: 4, name: 'Hoãn lại'},
        {id: 5, name: 'Sao chép'},
        {id: 6, name: 'Xóa'},
    ]
    loading: boolean = false;
    sortFields: any[] = [];
    sortTypes: any[] = [];
    selectedJob: UserTaskModeList
    result: TypeData<UserTaskModeList> = {
        data: [],
        currentPage: 0,
        nextStt: 0,
        pageSize: 10,
        totalItems: 0
    }
    param: UserTaskRequestModel = {
        page: 1,
        pageSize: 10,
    }
    exportParam: UserTaskRequestModel = {
        startDate: new Date(),
        endDate: new Date(),
        status: null,
        departmentId: null
    }
    status = []
    departments: Department[] = []
    subjectDept = new Subject<string>()

    expiredWork: ExpiredModel = {
        month: new Date(),
        expired: [],
        expiredToday: [],
        expiredCurrentWeek: [],
        expiredNextWeek: [],
        notExpired: []
    }
    kanbanWorks: KanbanModel[] = []
    draggedJob: UserTaskModeList

    events: any[] = []
    calendarOption: CalendarOptions
    calendarApi: Calendar
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    constructor(
        private router: Router,
        private workflowService: WorkflowService,
        private messageService: MessageService,
        private translateService: TranslateService,
        private readonly departmentService: DepartmentService,
        private readonly userService: UserService
    ) {
    }

    ngAfterViewInit(): void {
        this.calendarApi = this.calendarComponent?.getApi()
    }

    ngOnInit(): void {
        this.activeItem = this.items[0]
        this.status = [
            {
                value: UserTaskStatus.OPENING,
                name: 'Đang mở'
            },
            {
                value: UserTaskStatus.DOING,
                name: 'Đang tiến hành'
            },
            {
                value: UserTaskStatus.PAUSE,
                name: 'Tạm hoãn'
            },
            {
                value: UserTaskStatus.COMPLETE,
                name: 'Hoàn thành'
            },
        ]
        this.getWorkList()
        this.getDepartments()
        this.subjectDept.pipe(debounceTime(500)).subscribe(value => {
            this.getDepartments(value)
        })
        this.calendarOption = {
            initialDate: new Date(),
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay',
            },
            buttonText: {
                today: 'Hôm nay',
                month: 'Tháng',
                week: 'Tuần',
                day: 'Ngày'
            },
            titleFormat: {
                month: '2-digit',
                year: 'numeric'
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            events: this.events,
            eventsSet: (event) => {
                this.onChangeCalendar()
            }
        }

    }

    getWorkList(event?: any) {
        this.loading = true;
        const _param = {
            page: Number(event?.first || 0) / Number(event?.rows || 1) + 1,
            pageSize: event?.rows || 10
        }
        this.workflowService.getListMode(_param).subscribe(response => {
            this.loading = false
            this.result = response
        }, err => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: AppUtil.translate(this.translateService, 'error.0')})
        })
    }

    getWorkListExpired(event?: any) {
        this.loading = true
        const _param = {
            page: 1,
            pageSize: (event?.first || 0 + event?.rows || 0) || 10
        }
        this.workflowService.getListMode(_param).subscribe((response) => {
            this.loading = false
            this.expiredWork.expired = []
            this.expiredWork.expiredToday = []
            this.expiredWork.expiredCurrentWeek = []
            this.expiredWork.expiredNextWeek = []
            response?.data?.map(item => {
                if (compareAsc(new Date(item.dueDate), startOfDay(new Date())) === -1)
                    this.expiredWork.expired.push({
                        ...item,
                        responsibleUserCreated: {
                            ...item.responsibleUserCreated,
                            avatar: this.serverImg + item.responsibleUserCreated?.avatar
                        }
                    })

                if (compareAsc(startOfDay(new Date(item.dueDate)), startOfDay(new Date())) === 0)
                    this.expiredWork.expiredToday.push({
                        ...item,
                        responsibleUserCreated: {
                            ...item.responsibleUserCreated,
                            avatar: this.serverImg + item.responsibleUserCreated?.avatar
                        }
                    })

                if (compareAsc(startOfDay(new Date(item.dueDate)), startOfDay(addDays(new Date(), 1))) > -1 &&
                    compareAsc(startOfDay(new Date(item.dueDate)), endOfWeek(new Date())) < 1)
                    this.expiredWork.expiredCurrentWeek.push({
                        ...item,
                        responsibleUserCreated: {
                            ...item.responsibleUserCreated,
                            avatar: this.serverImg + item.responsibleUserCreated?.avatar
                        }
                    })

                if (compareAsc(startOfDay(new Date(item.dueDate)), startOfWeek(addWeeks(new Date(), 1))) > -1 &&
                    compareAsc(startOfDay(new Date(item.dueDate)), endOfWeek(addWeeks(new Date(), 1))) < 1)
                    this.expiredWork.expiredNextWeek.push({
                        ...item,
                        responsibleUserCreated: {
                            ...item.responsibleUserCreated,
                            avatar: this.serverImg + item.responsibleUserCreated?.avatar
                        }
                    })

                if (!item.dueDate)
                    this.expiredWork.notExpired.push({
                        ...item,
                        responsibleUserCreated: {
                            ...item.responsibleUserCreated,
                            avatar: this.serverImg + item.responsibleUserCreated?.avatar
                        }
                    })
            })
        }, err => {
        })
    }

    getWorkListCalendar(param?: UserTaskRequestModel) {
        this.loading = true;
        const _param = {
            page: 0,
            startDate: param?.startDate?.toISOString() || startOfDay(new Date()).toISOString(),
            endDate: param?.endDate?.toISOString() || endOfDay(new Date()).toISOString()
        }
        this.workflowService.getListMode(_param).subscribe(response => {
            this.loading = false
            const _events = []
            response?.data?.map((item) => {
                _events.push({
                    id: item.id,
                    title: item.name,
                    start: addHours(new Date(item.dueDate), -1 * Number(item.actualHours | 0)),
                    end: new Date(item.dueDate)
                })
            })
            this.calendarOption.events = _events
        })
    }

    getWorkListKanban(event?: any) {
        this.loading = true;
        const _param = {
            page: Math.floor(Number(event?.first || 0) / Number(event?.rows | 1)) || 1,
            pageSize: event?.rows || 10
        }
        this.workflowService.getListMode(_param).subscribe((response) => {
            this.loading = false
            const data = _.groupBy(response.data, ['createPerson'])
            const _kanbanWorks = []
            Object.keys(data)?.map((key) => {
                const values = data[key] as UserTaskModeList[]
                _kanbanWorks.push({
                    user: {
                        ...values?.[0]?.responsibleUserCreated,
                        avatar: this.serverImg + values?.[0]?.responsibleUserCreated?.avatar
                    },
                    todo: values?.filter(item => [UserTaskStatus.OPENING, UserTaskStatus.PAUSE].includes(item.status)) || [],
                    inProgress: values?.filter(item => item.status === UserTaskStatus.DOING) || [],
                    done: values?.filter(item => item.status === UserTaskStatus.COMPLETE) || [],
                })
            })
            if (!this.kanbanWorks?.length)
                this.kanbanWorks = _kanbanWorks
            else
                this.kanbanWorks?.map((kanban) => {
                    const newValue = _kanbanWorks?.find((kb) => kb.user?.fullName === kanban?.user.fullName)
                    const todoIds = kanban?.todo?.map(item => {
                        return item.id
                    })
                    const inProgressIds = kanban?.inProgress?.map(item => {
                        return item.id
                    })
                    const doneIds = kanban?.done?.map(item => {
                        return item.id
                    })
                    kanban.todo = [
                        ...kanban?.todo,
                        ...newValue?.todo?.filter(x => !todoIds.includes(x.id)) || []]
                    kanban.inProgress = [
                        ...kanban?.inProgress,
                        ...newValue?.inProgress?.filter(x => !inProgressIds.includes(x.id)) || []]
                    kanban.done = [
                        ...kanban?.done,
                        ...newValue?.done?.filter(x => !doneIds.includes(x.id)) || []]
                })
        })
    }

    onAddWorkflow() {
        this.display = true
        this.formData = {}
    }

    dragStartTodo(job: UserTaskModeList) {
        this.draggedJob = job
    }

    dragEndTodo() {
        // this.draggedJob = null
    }

    dropTodo(event) {
        if (this.draggedJob && this.draggedJob.status !== UserTaskStatus.OPENING) {
            this.loading = true
            this.workflowService.statusTask({
                userTaskId: this.draggedJob.id,
                status: UserTaskStatus.PAUSE
            }).subscribe((res) => {
                this.loading = false
                if (res) {
                    const kanbanWork = this.kanbanWorks.find(kb => kb.user?.fullName === this.draggedJob?.responsibleUserCreated?.fullName)
                    const kanbanWorkIndex = this.kanbanWorks.indexOf(kanbanWork)
                    kanbanWork.todo = [
                        ...(kanbanWork.todo || []),
                        {
                            ...this.draggedJob,
                            status: UserTaskStatus.PAUSE
                        }
                    ]
                    switch (this.draggedJob?.status) {
                        case UserTaskStatus.DOING:
                            kanbanWork.inProgress = kanbanWork.inProgress.filter(x => x.id !== this.draggedJob.id)
                            break
                        case UserTaskStatus.COMPLETE:
                            kanbanWork.done = kanbanWork.done.filter(x => x.id !== this.draggedJob.id)
                            break
                    }
                    this.kanbanWorks[kanbanWorkIndex] = kanbanWork
                }
                this.draggedJob = null
            }, err => {
                this.loading = false
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
                this.draggedJob = null
            })
        }
    }

    dragStartInProgress(job: UserTaskModeList) {
        this.draggedJob = job
    }

    dragEndInProgress() {
        // this.draggedJob = null
    }

    dropInProgress(event) {
        if (this.draggedJob && this.draggedJob.status !== UserTaskStatus.DOING) {
            this.loading = true
            this.workflowService.statusTask({
                userTaskId: this.draggedJob.id,
                status: UserTaskStatus.DOING
            }).subscribe((res) => {
                this.loading = false
                if (res) {
                    const kanbanWork = this.kanbanWorks.find(kb => kb.user?.fullName === this.draggedJob?.responsibleUserCreated?.fullName)
                    const kanbanWorkIndex = this.kanbanWorks.indexOf(kanbanWork)
                    kanbanWork.inProgress = [
                        ...(kanbanWork.inProgress || []),
                        {
                            ...this.draggedJob,
                            status: UserTaskStatus.DOING
                        }
                    ]
                    switch (this.draggedJob?.status) {
                        case UserTaskStatus.OPENING:
                            kanbanWork.todo = kanbanWork.todo.filter(x => x.id !== this.draggedJob.id)
                            break
                        case UserTaskStatus.COMPLETE:
                            kanbanWork.done = kanbanWork.done.filter(x => x.id !== this.draggedJob.id)
                            break
                    }
                    this.kanbanWorks[kanbanWorkIndex] = kanbanWork
                }
                this.draggedJob = null
            }, err => {
                this.loading = false
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
                this.draggedJob = null
            })
        }
    }

    dragStartDone(job: UserTaskModeList) {
        this.draggedJob = job
    }

    dragEndDone() {
        // this.draggedJob = null
    }

    dropDone(event) {
        if (this.draggedJob && this.draggedJob.status === UserTaskStatus.DOING) {
            this.loading = true
            this.workflowService.statusTask({
                userTaskId: this.draggedJob.id,
                status: UserTaskStatus.COMPLETE
            }).subscribe((res) => {
                this.loading = false
                if (res) {
                    const kanbanWork = this.kanbanWorks.find(kb => kb.user?.fullName === this.draggedJob?.responsibleUserCreated?.fullName)
                    const kanbanWorkIndex = this.kanbanWorks.indexOf(kanbanWork)
                    kanbanWork.done = [
                        ...(kanbanWork.done || []),
                        {
                            ...this.draggedJob,
                            status: UserTaskStatus.COMPLETE
                        }
                    ]
                    kanbanWork.inProgress = kanbanWork.inProgress.filter(x => x.id !== this.draggedJob.id)
                    this.kanbanWorks[kanbanWorkIndex] = kanbanWork
                }
                this.draggedJob = null
            }, err => {
                this.loading = false
                this.messageService.add({
                    severity: 'error',
                    detail: AppUtil.translate(this.translateService, 'error.0')
                })
                this.draggedJob = null
            })
        }
    }

    getDepartments(keyword?: string) {
        this.param.searchText = keyword || ''
        const _param = {
            ...this.param,
        }
        this.departmentService.getListDepartment(_param).subscribe(res => {
            this.departments = res?.data || []
        }, error => {
            this.departments = []
        })
    }

    onFilterDepartment(event: any) {
        if (event)
            this.subjectDept.next(event.filter)
    }

    exportData() {
        this.loading = true
        this.workflowService.export(this.exportParam).subscribe((res) => {
            this.loading = false
            saveAs(res, `Danh_sach_cong_viec_${format(new Date(), 'ddMMyyHHmm')}`)
        }, err => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: AppUtil.translate(this.translateService, 'error.0')})
        })
    }

    onCancelForm(event) {
        this.display = false
        this.formData = {}
    }

    onDeleteWorkflow() {
        this.loading = true
        this.workflowService.delete(this.selectedJob.id).subscribe(res => {
            this.loading = false
            this.messageService.add({severity: 'success', detail: 'Xóa thành công'})
        }, error => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: 'Xóa thất bại'})
        })
    }

    onEditWorkflow() {
        this.loading = true
        this.workflowService.getById(this.selectedJob.id).subscribe((res) => {
            if (res) {
                const userIds = [
                    res.userCreated,
                    ...res.taskRole?.map(item => {
                        return item.userId
                    }) || []
                ] || []
                this.userService.getPagingUser({
                    page: 1,
                    pageSize: userIds.length,
                    ids: userIds
                }).subscribe((userResponse) => {
                    this.loading = false
                    const responsiblePersonIds = res.taskRole?.filter(item => item.userTaskRoleId === UserTaskRole.RESPONSIBLE)?.map(per => per.id) || []
                    const joinedPersonIds = res.taskRole?.filter(item => item.userTaskRoleId === UserTaskRole.JOINED)?.map(per => per.id) || []
                    const viewedPersonIds = res.taskRole?.filter(item => item.userTaskRoleId === UserTaskRole.VIEWER)?.map(per => per.id) || []
                    this.formData = {
                        ...res,
                        dueDate: new Date(res.dueDate),
                        userCreateName: userResponse?.data?.find(per => per.id === res.userCreated)?.fullName,
                        responsiblePerson: userResponse?.data?.filter(per => responsiblePersonIds.includes(per.id))?.map((item) => {
                            return {
                                ...item,
                                avatar: this.serverImg + item.avatar
                            }
                        }) || [],
                        joinedPersons: userResponse?.data?.filter(per => joinedPersonIds.includes(per.id))?.map((item) => {
                            return {
                                ...item,
                                avatar: this.serverImg + item.avatar
                            }
                        }) || [],
                        viewedPersons: userResponse?.data?.filter(per => viewedPersonIds.includes(per.id))?.map((item) => {
                            return {
                                ...item,
                                avatar: this.serverImg + item.avatar
                            }
                        }) || [],
                    }
                    this.display = true
                    this.overlayPanel.hide()
                }, err => {
                    this.loading = false
                    this.messageService.add({severity: 'error', detail: 'error.0'})
                })
            }
        }, err => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: 'error.0'})
        })
    }

    onPinWorkflow() {
        this.loading = true
        this.workflowService.pinTask(this.selectedJob.id).subscribe((res) => {
            this.loading = false
            this.messageService.add({severity: 'success', detail: 'success.pin'})
        }, err => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: 'error.0'})
        })
    }

    onChangeStatusWorkflow(status: UserTaskStatus) {
        this.loading = true
        this.workflowService.statusTask({
            userTaskId: this.selectedJob.id,
            status: status
        }).subscribe((res) => {
            this.loading = false
            this.messageService.add({severity: 'success', detail: 'success.update_status'})
        }, err => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: 'error.0'})
        })
    }

    onCopyWorkflow() {
        this.loading = true
        this.workflowService.copy(this.selectedJob.id).subscribe((res) => {
            this.loading = false
            this.messageService.add({severity: 'success', detail: 'success.copy'})
        }, err => {
            this.loading = false
            this.messageService.add({severity: 'error', detail: 'error.0'})
        })
    }

    onChangeCalendar() {
        if (this.calendarApi) {
            const startDate = startOfDay(this.calendarApi.currentData?.currentDate)
            let endDate
            switch (this.calendarApi.currentData?.currentViewType) {
                case 'dayGridMonth':
                    endDate = endOfMonth(startDate)
                    break
                case 'dayGridWeek':
                    endDate = endOfWeek(startDate)
                    break
                case 'dayGridDay':
                    endDate = endOfDay(startDate)
                    break
            }
            this.getWorkListCalendar({
                startDate: startDate,
                endDate: endDate
            })
        }
    }
}
