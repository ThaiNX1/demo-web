import { AccountGroupSyncModel } from "src/app/models/account-group-sync.model";
import { AccountGroupSyncAutoComplete } from "src/app/shared/is-table/is-table.model";

export class AddEditAccountGroupTableModel extends AccountGroupSyncModel {
    
    accountAutocompleteModel: AccountGroupSyncAutoComplete;

    constructor(data?: any) {
        super(data);
    }
}