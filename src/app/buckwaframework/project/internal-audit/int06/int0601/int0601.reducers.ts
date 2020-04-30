import { FormSearch } from './int0601.model';
import * as INT0601ACTION from './int0601.action'
import { Tab1 } from './int060101/int060101.model';
import { Tab2 } from './int060102/int060102.model';
import { Tab3 } from './int060103/int060103.model';




//-------- FORM_SEARCH------------------
const FORM_SEARCH =
{
    sector: "",
    area: "",
    branch: "",
    officeReceive: "",
    receiptDateFrom: "",
    receiptDateTo: "",
    auditIncNo: "",
    flag: ""
}

export function formSearchReducer(state: FormSearch = FORM_SEARCH, action: INT0601ACTION.Actions) {
    switch (action.type) {
        case INT0601ACTION.ADD_DATA_SEARCH:
            return Object.assign({}, action.payload);
        case INT0601ACTION.REMOVE_DATA_SEARCH:
            return FORM_SEARCH;
        default:
            return state;
    }
}


//-------- TAB_1------------------
const TAB_1 =
{
    d1AuditFlag: "",
    d1ConditionText: "",
    d1CriteriaText: "",
    d4ConditionText: "",
    d4CriteriaText: "",
    iaAuditIncD1List: []
}

export function tab1Reducer(state: Tab1 = TAB_1, action: INT0601ACTION.Actions) {
    switch (action.type) {
        case INT0601ACTION.ADD_T1:
            return Object.assign({}, action.payload);
        case INT0601ACTION.REMOVE_T1:
            return TAB_1;
        default:
            return state;
    }
}

//------ TAB 2 ------------------
const TAB_2 =
{
    d2ConditionText: "",
    d2CriteriaText: "",
    iaAuditIncD2List: []
}
export function tab2Reducer(state: Tab2 = TAB_2, action: INT0601ACTION.Actions) {
    switch (action.type) {
        case INT0601ACTION.ADD_T2:
            return Object.assign({}, action.payload);
        case INT0601ACTION.REMOVE_T2:
            return TAB_2;
        default:
            return state;
    }
}

//------ TAB 3 ------------------
const TAB_3 =
{
    d3ConditionText: "",
    d3CriteriaText: "",
    iaAuditIncD3List: []
}
export function tab3Reducer(state: Tab3 = TAB_3, action: INT0601ACTION.Actions) {
    switch (action.type) {
        case INT0601ACTION.ADD_T3:
            return Object.assign({}, action.payload);
        case INT0601ACTION.REMOVE_T3:
            return TAB_3;
        default:
            return state;
    }
}

export const reducers = {
    tab1: tab1Reducer,
    tab2: tab2Reducer,
    tab3: tab3Reducer,
    formSearch: formSearchReducer
};