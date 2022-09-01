export interface Document {
    id: number;
    stt: number;
    code: string;
    name: string;
    debitCode: string;
    nameDebitCode: string;
    creditCode: string;
    nameCreditCode: string;
    allowDelete: boolean;
    check: boolean;
    userId: string;
    userCode: string;
    userFullName: string;
    nextStt: number;
    title: string;
}

export interface Position{
    id: number;
    name: string;
    positionId: string;
    isDelete: boolean;
}

export interface Department{
    id: number;
    name: string;
    code: string;
    isDelete: boolean;
}

export interface Target{
    id: number;
    name: string;
    code: string;
    isDelete: boolean;
    address: string;
    armyNumber:number;
    present: number;
    nameContact: string;
    dateInvoice:string;
    unitPrice: number;
    total: number;
    startDate: string;
    endDate:string;
    phone: string;
    identityCode: string;
    note: string;
    status:boolean;
    order: number;
    checkedInCount: number;
}

export interface Degree{
    createAt: string;
    updateAt: string;
    deleteAt: string;
    isDelete: boolean;
    userCreated: string;
    userUpdated: string;
    id:	number;
    name: string;
    description: string;
    companyId: number;
    status:boolean;
    order: number;
}

