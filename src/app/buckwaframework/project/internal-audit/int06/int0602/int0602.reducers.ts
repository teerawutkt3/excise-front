import { FormSearch } from './int0602.model';
import * as INT0602ACTION from './int0602.action'
//-------- FORM_SEARCH------------------
const FORM_SEARCH =
{
    sector: "",
    area: "",
    officeCode: "",
    licDateFrom: "",
    licDateTo: "",
    auditIncNo: "",
    flag: ""
}

export function formSearchReducer(state: FormSearch = FORM_SEARCH, action: INT0602ACTION.Actions) {
    switch (action.type) {
        case INT0602ACTION.ADD_DATA_SEARCH:
            return Object.assign({}, action.payload);
        case INT0602ACTION.REMOVE_DATA_SEARCH:
            return FORM_SEARCH;
        default:
            return state;
    }
}

export const reducers = {
    formSearch: formSearchReducer
};