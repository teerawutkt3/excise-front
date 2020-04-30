export interface IaAuditIncD2List {
    id: string;
    iaAuditIncD2Id: string;
    receiptDate: string;
    amount: string;
    printPerDay: string;
    auditCheck: string;
    remark: string;
}
export interface RequestModel {
    officeReceive: string,
    receiptDateFrom: string,
    receiptDateTo: string,
}


export interface Tab2 {
    d2ConditionText: string;
    d2CriteriaText: string;
    iaAuditIncD2List: IaAuditIncD2List[];
}