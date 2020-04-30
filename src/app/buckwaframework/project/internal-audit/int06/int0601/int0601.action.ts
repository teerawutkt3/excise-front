import { Action } from '@ngrx/store';
import { FormSearch } from './int0601.model';
import { Tab1 } from './int060101/int060101.model';
import { Tab2 } from './int060102/int060102.model';
import { Tab3 } from './int060103/int060103.model';

//--------------------------------------
export const ADD_DATA_SEARCH = 'Int0601 => ADD_DATA_SEARCH';
export const REMOVE_DATA_SEARCH = 'Int0601 => REMOVE_DATA_SEARCH';

export class AddDataSearch implements Action {
    readonly type = ADD_DATA_SEARCH
    constructor(public payload: FormSearch) { }
}
export class RemoveDataSearch implements Action {
    readonly type = REMOVE_DATA_SEARCH
    constructor() { }
}
//--------------------------------------
export const ADD_T1 = 'Int0601 => ADD_T1';
export const REMOVE_T1 = 'Int0601 => REMOVE_T1';

export class AddTab1 implements Action {
    readonly type = ADD_T1
    constructor(public payload: Tab1) { }
}
export class RemoveTab1 implements Action {
    readonly type = REMOVE_T1
    constructor() { }
}

//-----------------------------------------
export const ADD_T2 = 'Int0601 => ADD_T2';
export const REMOVE_T2 = 'Int0601 => REMOVE_T2';

export class AddTab2 implements Action {
    readonly type = ADD_T2
    constructor(public payload: Tab2) { }
}
export class RemoveTab2 implements Action {
    readonly type = REMOVE_T2
    constructor() { }
}

//-----------------------------------------
export const ADD_T3 = 'Int0601 => ADD_T3';
export const REMOVE_T3 = 'Int0601 => REMOVE_T3';

export class AddTab3 implements Action {
    readonly type = ADD_T3
    constructor(public payload: Tab3) { }
}
export class RemoveTab3 implements Action {
    readonly type = REMOVE_T3
    constructor() { }
}

export type Actions = AddDataSearch | RemoveDataSearch
    | AddTab1 | RemoveTab1 | AddTab2 | RemoveTab2 | AddTab3 | RemoveTab3
