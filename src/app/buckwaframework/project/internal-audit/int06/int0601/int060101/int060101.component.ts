import { Component, OnInit } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { Store } from '@ngrx/store';
import { FormSearch } from '../int0601.model';
import * as INT0601ACTION from '../int0601.action'
import { Tab1 } from './int060101.model';
import { Utils } from 'helpers/utils';
declare var $: any;

const URL = {
  SEARCH: "ia/int06/01/find-tab1",
  SEARCH_BY_AUDIT_NO: "ia/int06/01/find-tab1-by-auditnumber"
}

@Component({
  selector: 'app-int060101',
  templateUrl: './int060101.component.html',
  styleUrls: ['./int060101.component.css']
})
export class Int060101Component implements OnInit {

  formDataT1: FormGroup;
  iaAuditIncD1List: FormArray = new FormArray([]);
  temp: FormArray = new FormArray([]);
  dataStore: any;
  flagSearch: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private router: Router,
    private messageBar: MessageBarService,
    private store: Store<AppState>

  ) {
    //call set form  data
    this.createFormDataT1();
  }

  ngOnInit() {
    this.dataStore = this.store.select(state => state.int0601).subscribe(datas => {
      console.log("datas=>Store:", datas);
      //----------------------cheack Search----------------------------------
      this.flagSearch = datas.formSearch.flag;
      console.log("this.flagSearch :", this.flagSearch);
      if (this.flagSearch == 'R') {         //R คือ  Read data form store 
        this.readDataStore(datas);
      } else if (this.flagSearch == 'Y') {   //Y คือ  searchCriteria
        this.searchCriteria(datas);
        datas.formSearch.flag = 'R';
      } else if (this.flagSearch == 'I' && Utils.isNotNull(datas.formSearch.auditIncNo)) {  //I คือ  searchByAuditNo
        this.searchByAuditNo(datas);
        datas.formSearch.flag = 'R';
      } else {
        datas.tab1.d1AuditFlag= '';
        datas.tab1.d1ConditionText='';
        datas.tab1.d1CriteriaText='';
        datas.tab1.d4ConditionText='';
        datas.tab1.d4CriteriaText='';
        datas.tab1.iaAuditIncD1List=[];
        this.iaAuditIncD1List = this.formDataT1.get('iaAuditIncD1List') as FormArray;
        this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
        this.iaAuditIncD1List.patchValue([]);
      }

    });

  }

  ngOnDestroy(): void {
    //unsubscribe store
    this.dataStore.unsubscribe();
  }

  onBlur() {
    //add data to store
    this.addDataStore();
  }

  //============== DATA FROM ============================
  createFormDataT1() {
    this.formDataT1 = this.fb.group({
      d1AuditFlag: [''],
      d1ConditionText: [''],
      d1CriteriaText: [''],
      iaAuditIncD1List: this.fb.array([])

    })

    this.iaAuditIncD1List = this.formDataT1.get('iaAuditIncD1List') as FormArray;

  }

  //============== DATA LIST ============================
  createItem(): FormGroup {
    return this.fb.group({
      officeCode: [''],
      docCtlNo: [''],
      receiptNo: [''],
      runCheck: [''],
      receiptDate: [''],
      taxName: [''],
      taxCode: [''],
      amount: [''],
      remark: [''],
      checkTax0307: [''],
      checkStamp: [''],
      checkTax0704: [''],
      remarkTax: [''],
    });
  }

  //======================================== Action ================================================
  reEditRunCheck(i, val) {
    console.log(val);
    for (let index = i; index < this.formDataT1.value.iaAuditIncD1List.length; index++) {
      this.iaAuditIncD1List.at(index).get('runCheck').patchValue(val);
      val++;
    }
  }

  editList(idx,receiptNo:any) {
    let index=idx+1;
    this.iaAuditIncD1List.insert(index, this.createItem());
    this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(receiptNo);
  }

  readDataStore(datas: any) {
    this.loading = true;
    //add obj
    this.formDataT1.patchValue({
      d1AuditFlag: datas.tab1.d1AuditFlag,
      d1ConditionText: datas.tab1.d1ConditionText,
      d1CriteriaText: datas.tab1.d1CriteriaText
    });
    //add obj list
    this.iaAuditIncD1List = this.formDataT1.get('iaAuditIncD1List') as FormArray;
    this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
    this.iaAuditIncD1List.patchValue([]);
    datas.tab1.iaAuditIncD1List.forEach((e, index) => {
      this.iaAuditIncD1List.push(this.createItem());
      this.iaAuditIncD1List.at(index).patchValue({
        officeCode: e.officeCode,
        docCtlNo: e.docCtlNo,
        receiptNo: e.receiptNo,
        runCheck: e.runCheck,
        receiptDate: e.receiptDate,
        taxName: e.taxName,
        taxCode: e.taxCode,
        amount: e.amount,
        remark: e.remark,
        checkTax0307: e.checkTax0307,
        checkStamp: e.checkStamp,
        checkTax0704: e.checkTax0704,
        remarkTax: e.remarkTax,
      });
    });
    this.loading = false;
  }


  addDataStore() {
    this.store.dispatch(new INT0601ACTION.AddTab1(this.formDataT1.value));
  }
  //======================================== Call Back_end ================================================
  searchCriteria = (datas: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SEARCH, datas.formSearch).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("res.data:", res.data);

        this.iaAuditIncD1List = this.formDataT1.get('iaAuditIncD1List') as FormArray;
        if (res.data.length > 0) {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD1List.push(this.createItem());
            this.iaAuditIncD1List.at(index).get('officeCode').patchValue(e.officeReceive);
            this.iaAuditIncD1List.at(index).get('docCtlNo').patchValue(e.incCtlNo);
            this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(e.receiptNo);
            this.iaAuditIncD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.iaAuditIncD1List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD1List.at(index).get('taxName').patchValue(e.incomeName);
            this.iaAuditIncD1List.at(index).get('taxCode').patchValue(e.incomeCode);
            this.iaAuditIncD1List.at(index).get('amount').patchValue(e.netTaxAmt);
            this.iaAuditIncD1List.at(index).get('remark').patchValue(e.remark);
          });
        } else {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formDataT1.patchValue({
          d1AuditFlag: '',
          d1ConditionText: '',
          d1CriteriaText: ''
        });

        this.addDataStore();  //add store

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchCriteria_Tab1 :", res.message);
      }
    });
    this.loading = false;
  }


  searchByAuditNo(datas: any) {
    this.loading = true;
    this.ajax.doPost(`${URL.SEARCH_BY_AUDIT_NO}`, datas.formSearch.auditIncNo).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("searchByAuditNo_Tab1", res.data);
        this.iaAuditIncD1List = this.formDataT1.get('iaAuditIncD1List') as FormArray;
        if (res.data.length > 0) {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD1List.push(this.createItem());
            this.iaAuditIncD1List.at(index).get('officeCode').patchValue(e.officeReceive);
            this.iaAuditIncD1List.at(index).get('docCtlNo').patchValue(e.docCtlNo);
            this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(e.receiptNo);
            this.iaAuditIncD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.iaAuditIncD1List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD1List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD1List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD1List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD1List.at(index).get('remark').patchValue(e.remark);
          });
        } else {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
        }

        //clear data textAraBox and radio
        this.formDataT1.patchValue({
          d1AuditFlag: datas.tab1.d1AuditFlag,
          d1ConditionText: datas.tab1.d1ConditionText,
          d1CriteriaText: datas.tab1.d1CriteriaText
        });

        this.addDataStore();  //add store
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditNo_Tab1 :", res.message);
      }
    });
    this.loading = false;
  }


}

interface AppState {
  int0601: {
    formSearch: FormSearch,
    tab1: Tab1
  }
}

