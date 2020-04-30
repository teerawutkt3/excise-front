import { FormSearch } from './int0602.model';
import { Action } from '@ngrx/store';

//--------------------------------------
export const ADD_DATA_SEARCH = 'ADD_DATA_SEARCH';
export const REMOVE_DATA_SEARCH = 'REMOVE_DATA_SEARCH';

export class AddDataSearch implements Action {
    readonly type = ADD_DATA_SEARCH
    constructor(public payload: FormSearch) { }
}
export class RemoveDataSearch implements Action {
    readonly type = REMOVE_DATA_SEARCH
    constructor() { }
}

export type Actions = AddDataSearch | RemoveDataSearch