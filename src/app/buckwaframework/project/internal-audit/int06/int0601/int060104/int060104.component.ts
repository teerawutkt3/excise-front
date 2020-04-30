import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as INT0601ACTION from '../int0601.action'
import { Utils } from 'helpers/utils';
@Component({
  selector: 'app-int060104',
  templateUrl: './int060104.component.html',
  styleUrls: ['./int060104.component.css']
})
export class Int060104Component implements OnInit {

  formGroup: FormGroup;
  formItem: FormArray = new FormArray([]);
  loading: boolean = false;
  dispathDataOnInit: string = 'YES';
  dataStore: any;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<any>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dataStore = this.store.select(state => state.int0601).subscribe(datas => {
      console.log("datas store => :", datas);
      if(  Utils.isNotNull(datas.formSearch.flag)|| Utils.isNotNull(datas.formSearch.auditIncNo)){
              //add list
      this.formItem = this.formGroup.get('iaAuditIncD1List') as FormArray;
      this.formItem.controls.splice(0, this.formItem.controls.length);
      this.formItem.patchValue([]);
      datas.tab1.iaAuditIncD1List.forEach((e, index) => {

        this.formItem.push(this.createItem());

        this.formItem.at(index).patchValue({
          officeCode: e.officeCode,
          docCtlNo: e.docCtlNo,
          receiptNo: e.receiptNo,
          runCheck: e.runCheck,
          receiptDate: e.receiptDate,
          taxName: e.taxName,
          taxCode: e.taxCode,
          amount: e.amount,
          remark: e.remark,

          checkTax0307: Utils.isNull(e.checkTax0307) ? '' : e.checkTax0307,
          checkStamp: Utils.isNull(e.checkStamp) ? '' : e.checkStamp,
          checkTax0704: Utils.isNull(e.checkTax0704) ? '' : e.checkTax0704,
          remarkTax: Utils.isNull(e.remarkTax) ? '' : e.remarkTax,
        })
      });

      if (this.dispathDataOnInit === 'YES')
        this.blur();
      this.dispathDataOnInit = 'NO';
      console.log('formItem', this.formItem)
      }else{
        datas.tab1.d1AuditFlag= '';
        datas.tab1.d1ConditionText='';
        datas.tab1.d1CriteriaText='';
        datas.tab1.d4ConditionText='';
        datas.tab1.d4CriteriaText='';
        datas.tab1.iaAuditIncD1List=[];

        this.formItem = this.formGroup.get('iaAuditIncD1List') as FormArray;
        this.formItem.controls.splice(0, this.formItem.controls.length);
        this.formItem.patchValue([]);

      }

    });
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      d4ConditionText: [''],
      d4CriteriaText: [''],
      iaAuditIncD1List: this.formBuilder.array([])

    })
    this.formItem = this.formGroup.get('iaAuditIncD2List') as FormArray;
  }
  createItem() {
    return this.formBuilder.group({
      officeCode: [''],
      docCtlNo: [''],
      receiptNo: [''],
      runCheck: [''],
      receiptDate: [''],
      taxName: [''],
      taxCode: [''],
      amount: [''],
      remark: [''],
      //tab4
      checkTax0307: [''],
      checkStamp: [''],
      checkTax0704: [''],
      remarkTax: [''],
    })
  }

  blur() {
    console.log('blur')
    this.store.dispatch(new INT0601ACTION.AddTab1(this.formGroup.value))
  }
}
