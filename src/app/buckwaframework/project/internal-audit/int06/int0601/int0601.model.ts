import { IaAuditIncD2List } from './int060102/int060102.model';
import { IaAuditIncD1List } from './int060101/int060101.model';

export interface FormSearch {
    sector: string,
    area: string,
    branch: string,
    officeReceive: string,
    receiptDateFrom: string,
    receiptDateTo: string,
    auditIncNo: any,
    flag: string
}

export interface RequestSave {
    iaAuditIncH: IaAuditTncH;
    iaAuditIncD1List: IaAuditIncD1List[];
    iaAuditIncD2List: IaAuditIncD2List[];
}

export interface IaAuditTncH {
    auditIncSeq: string;
    officeCode: string;
    receiptDateFrom: string;
    receiptDateTo: string;
    auditIncNo: string;
    d1AuditFlag: string;
    d1ConditionText: string;
    d1CriteriaText: string;
    d2ConditionText: string;
    d2CriteriaText: string;
    d3ConditionText: string;
    d3CriteriaText: string;
    d4ConditionText: string;
    d4CriteriaText: string;
}