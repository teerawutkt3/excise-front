
export interface RequestModel {
    officeReceive: string,
    receiptDateFrom: string,
    receiptDateTo: string,
}

export interface IaAuditIncD3List {
    taxCode: string;
    taxName: string;
    amount: string;
    countReceipt: string;
    auditCheck: string;
    remark: string;
}

export interface Tab3 {
    d3ConditionText: string;
    d3CriteriaText: string;
    iaAuditIncD3List: IaAuditIncD3List[];
}

