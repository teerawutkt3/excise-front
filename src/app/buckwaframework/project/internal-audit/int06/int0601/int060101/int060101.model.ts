

export interface IaAuditIncD1List {
    officeCode: string;
    docCtlNo: string;
    receiptNo: string;
    runCheck: string;
    receiptDate: string;
    taxName: string;
    taxCode: string;
    amount: string;
    remark: string;
    checkTax0307: string;
    checkStamp: string;
    checkTax0704: string;
    remarkTax: string;
}

export interface Tab1 {
    d1AuditFlag: string;
    d1ConditionText: string;
    d1CriteriaText: string;
    d4ConditionText: string;
    d4CriteriaText: string;
    iaAuditIncD1List: IaAuditIncD1List[];
}


