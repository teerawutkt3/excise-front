import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { RequestModel, IaAuditIncD2List, Tab2 } from './int060102.model';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import * as TA0601ACTION from '../int0601.action';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { setDefaultService } from 'selenium-webdriver/chrome';
import { load } from '@angular/core/src/render3';
declare var $: any;

const URL = {
  SEARCH: "ia/int06/01/find-tab2",
  SEARCH_BY_AUDIT_NO: "ia/int06/01/find-tab2-by-auditnumber"
}

@Component({
  selector: 'app-int060102',
  templateUrl: './int060102.component.html',
  styleUrls: ['./int060102.component.css']
})
export class Int060102Component implements OnInit {

  response: IaAuditIncD2List[];
  request: RequestModel;
  dataStore: any;

  dataTab2: Tab2;
  formGroup: FormGroup;
  formItem: FormArray = new FormArray([]);
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<any>
  ) {
    this.request = {
      officeReceive: '',
      receiptDateFrom: '',
      receiptDateTo: ''
    }
    this.dataTab2 = {
      d2ConditionText: '',
      d2CriteriaText: '',
      iaAuditIncD2List: []
    }
    this.createForm()
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      d2ConditionText: [''],
      d2CriteriaText: [''],
      iaAuditIncD2List: this.formBuilder.array([])

    })

    this.formItem = this.formGroup.get('iaAuditIncD2List') as FormArray;
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      auditCheck: [''],
      remark: [''],
      receiptDate: [''],
      amount: [''],
      printPerDay: [''],
    });
  }
  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  ngOnInit() {

    this.dataStore = this.store.select(state => state.int0601).subscribe(datas => {
      // this.loading = true;
      console.log("datas:", datas);

      let length = datas.tab2.iaAuditIncD2List.length;
      this.request = {
        officeReceive: datas.formSearch.officeReceive,
        receiptDateFrom: datas.formSearch.receiptDateFrom,
        receiptDateTo: datas.formSearch.receiptDateTo
      }

      console.log('checkFlag', datas.formSearch)

      if (Utils.isNotNull(datas.formSearch.flag) && length == 0 && Utils.isNull(datas.tab2.d2ConditionText) && Utils.isNull(datas.tab2.d2CriteriaText)) {
        // check  auditIncNo  
        if (Utils.isNotNull(datas.formSearch.auditIncNo)) {
          this.searchByAuditNo(datas);
          console.log("searchByAuditNo_Tab2");//searchByAuditNo_Tab2
        }else{
          this.getDataTab2(this.request);//searchCriteria
          console.log("getDataTab2");
        }
      } else {
        this.response = datas.tab2.iaAuditIncD2List;

        this.formGroup.patchValue({
          d2ConditionText: datas.tab2.d2ConditionText,
          d2CriteriaText: datas.tab2.d2CriteriaText
        })

        //add list
        if (this.response.length > 0) {
          this.formItem.controls.splice(0, this.formItem.controls.length);
          this.formItem.patchValue([]);
          this.response.forEach((e, index) => {
            this.formItem.push(this.createItem());
            this.formItem.at(index).get('id').patchValue(e.id);
            this.formItem.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.formItem.at(index).get('remark').patchValue(e.remark);
            this.formItem.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.formItem.at(index).get('amount').patchValue(e.amount);
            this.formItem.at(index).get('printPerDay').patchValue(e.printPerDay);
          });
        } else {
          this.formItem.controls.splice(0, this.formItem.controls.length);
          this.formItem.patchValue([]);
        }
      }

    });
  }
  //=====action============
  onBlurTextArea() {
    this.addDataStore();
  }
  blurRemark(id: string) {
    console.log('blurRemark id: ', id)
    this.addDataStore();
  }
  changeAudit() {
    this.addDataStore();
  }

  addDataStore() {
    this.dataTab2 = {
      d2ConditionText: this.formGroup.get('d2ConditionText').value,
      d2CriteriaText: this.formGroup.get('d2CriteriaText').value,
      iaAuditIncD2List: this.formItem.value
    }

    this.store.dispatch(new TA0601ACTION.AddTab2(this.dataTab2));
  }
  //========================= backend ===========================
  getDataTab2(request: RequestModel) {
    this.loading = true;
    this.ajax.doPost(`${URL.SEARCH}`, request).subscribe((res: ResponseData<IaAuditIncD2List[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.response = res.data;
        //add list
        this.formItem = this.formGroup.get('iaAuditIncD2List') as FormArray;
        if (res.data.length > 0) {
          this.formItem.controls.splice(0, this.formItem.controls.length);
          this.formItem.patchValue([]);
          res.data.forEach((e, index) => {
            this.formItem.push(this.createItem());
            this.formItem.at(index).get('id').patchValue(e.id);
            this.formItem.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.formItem.at(index).get('remark').patchValue(e.remark);
            this.formItem.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.formItem.at(index).get('amount').patchValue(e.amount);
            this.formItem.at(index).get('printPerDay').patchValue(e.printPerDay);
          });
        } else {
          this.formItem.controls.splice(0, this.formItem.controls.length);
          this.formItem.patchValue([]);
        }

      } else {
        this.messageBar.errorModal("error searchByAuditNo_Tab2")
      }
      this.addDataStore();
      this.loading = false;
    })
  }

  searchByAuditNo(datas: any) {
    this.loading = true;
    this.ajax.doPost(`${URL.SEARCH_BY_AUDIT_NO}`, datas.formSearch.auditIncNo).subscribe((res: any) => {
      console.log("res data : ",res.data);
      
      // if (MessageService.MSG.SUCCESS == res.status) {
      //   console.log("searchByAuditNo_Tab1", res.data);
      // } else {
      //   this.messageBar.errorModal("error searchByAuditNo_Tab2")
      // }
      
    });
    this.loading = false;
  }


}
