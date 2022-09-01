import { AccountGroupDetailModel } from "src/app/models/account-group.model";
import { NameValueOfInt } from "src/app/models/common.model";

export class AccountGroupDetailListModel extends AccountGroupDetailModel {
    expanded: boolean;
    excelType?: NameValueOfInt;

    constructor(){
        super();
    }
}

export enum AccountType {
    HT = 1,
    NB
};

export const AccountTypeList: NameValueOfInt[] = [<NameValueOfInt>{
    name: 'Hạch toán',
    value: AccountType.HT
}, <NameValueOfInt>{
    name: 'Nội bộ',
    value: AccountType.NB
}];

export enum ColumnActionType {
    Add = 1,
    Edit,
    Delete
}

export enum AddAccountDetailType {
    CT1 = 1,
    CT2
}