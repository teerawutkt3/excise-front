import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, PathTsSelect } from '../ta0301.model';
import { MessageService } from 'services/message.service';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { ResponseData } from 'models/response-data.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Observable } from 'rxjs';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0118",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta030118',
  templateUrl: './ta030118.component.html',
  styleUrls: ['./ta030118.component.css']
})
export class Ta030118Component implements OnInit, AfterViewInit {

  formGroup: FormGroup
  items: FormArray;
  submit: boolean = false;
  loading: boolean = false;
  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;

  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ta0301Service: Ta0301Service
  ) {
    this.createForm()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();
  }
  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.formGroup.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      console.log("store =>", datas)
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0118)
      if (Utils.isNotNull(this.formGroup.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup.get('formTsNumber').value);
      }
    });
  }
  ngAfterViewInit(): void {
    this.callCalendarDefault('calendarDocDate', 'docDate', 'date');
    this.callCalendarDefault('calendarAuditDateStart', 'auditDateStart', 'date');
    this.callCalendarDefault('calendarAuditDateEnd', 'auditDateEnd', 'date');
    this.callCalendarDefault('calendarSignOfficerDate1', 'signOfficerDate1', 'date');
    this.callCalendarDefault('calendarSignOfficerDate2', 'signOfficerDate2', 'date');
    this.callCalendarDefault('calendarExtraMoneyDate', 'extraMoneyDate', 'date');
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      bookNumber1: [''],
      bookNumber2: [''],
      docDate: [''],
      ownerFullName: [''],
      factoryType: [''],
      factoryName: [''],
      newRegId: [''],
      factoryAddress: [''],
      companyAddress: [''],
      lawSection: [''],
      lawGroup: [''],
      auditDateStart: [''],
      auditDateEnd: [''],
      sumAllTaxAmt: [''],
      sumAllTaxText: [''],
      officeName: [''],
      tableHeaderDutyType: [''],
      tableHeaderUnit: [''],
      taFormTS0118DtlVoList: this.formBuilder.array([this.createItem()]),
      reasonText: [''],
      signOfficerFullName1: [''],
      signOfficerDate1: [''],
      signOfficerFullName2: [''],
      signOfficerDate2: [''],
      extraMoneyDate: [''],
    })
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      formTs0118DtlId: [''],
      recNo: [''],
      dutyTypeText: [''],
      goodsQty: [''],
      goodsValue: [''],
      taxRate: [''],
      taxAmt: [''],
      fineAmt: [''],
      extraAmt: [''],
      sumTaxAmt: [''],
      fundHealthAmt: [''],
      fundTVAmt: [''],
      fundSportAmt: [''],
      otherAmt: [''],
      sumAllTaxAmt: [''],
      moiAmt: [''],
      netTaxAmt: [''],
    });
  }
  addItem(): void {
    this.items = this.formGroup.get('taFormTS0118DtlVoList') as FormArray;
    this.items.push(this.createItem());
    console.log("addItem :", this.items.controls);

  }
  removeItem(idx): void {
    console.log("removeItem  idx :", idx);
    this.items.removeAt(idx)
  }
  clearItem() {
    this.items = this.formGroup.get('taFormTS0118DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createItem());
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formGroup.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formGroup.value).toString())
        this.loading = true;

        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  clear(e) {
    this.formGroup.reset();
    this.clearItem();
  }
  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formGroup.get('formTsNumber').value)

        console.log("export : ", this.formGroup.value)
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formGroup.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })


  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formGroup.get('newRegId').value)
    let newRegId = this.formGroup.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  //==================== backend =================================================
  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formGroup.patchValue({
          factoryName: res.data.facFullname,
          factoryAddress: res.data.facAddress,
          companyAddress: res.data.customerAddress,
          factoryType: res.data.factoryType
        })
        console.log("formTS0117: ", this.formGroup.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }

  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doGet(`ta/report/form-ts-number/${this.pathTs}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }
          if (res.data.length != 0) {
            this.formGroup.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 18");
        }
      })
    })
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0118/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docDate: json.docDate,
          ownerFullName: json.ownerFullName,
          factoryType: json.factoryType,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          factoryAddress: json.factoryAddress,
          companyAddress: json.companyAddress,
          lawSection: json.lawSection,
          lawGroup: json.lawGroup,
          auditDateStart: json.auditDateStart,
          auditDateEnd: json.auditDateEnd,
          sumAllTaxAmt: json.sumAllTaxAmt,
          sumAllTaxText: json.sumAllTaxText,
          officeName: json.officeName,
          tableHeaderDutyType: json.tableHeaderDutyType,
          tableHeaderUnit: json.tableHeaderUnit,
          reasonText: json.reasonText,
          signOfficerFullName1: json.signOfficerFullName1,
          signOfficerDate1: json.signOfficerDate1,
          signOfficerFullName2: json.signOfficerFullName2,
          signOfficerDate2: json.signOfficerDate2,
          extraMoneyDate: json.extraMoneyDate,
        })

        this.items = this.formGroup.get('taFormTS0118DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items
        for (let i = 0; i < json.taFormTS0118DtlVoList.length; i++) {
          this.items.push(this.createItem());
          console.log('add item ==> i : ', i);
        }

        let i = 0;
        json.taFormTS0118DtlVoList.forEach(element => {
          this.items = this.formGroup.get('taFormTS0118DtlVoList') as FormArray;
          this.items.at(i).patchValue({
            formTs0118DtlId: `${element.formTs0118DtlId}`,
            recNo: `${element.recNo}`,
            dutyTypeText: `${element.dutyTypeText}`,
            goodsQty: `${element.goodsQty}`,
            goodsValue: `${element.goodsValue}`,
            taxRate: `${element.taxRate}`,
            taxAmt: `${element.taxAmt}`,
            fineAmt: `${element.fineAmt}`,
            extraAmt: `${element.extraAmt}`,
            sumTaxAmt: `${element.sumTaxAmt}`,
            fundHealthAmt: `${element.fundHealthAmt}`,
            fundTVAmt: `${element.fundTVAmt}`,
            fundSportAmt: `${element.fundSportAmt}`,
            otherAmt: `${element.otherAmt}`,
            sumAllTaxAmt: `${element.sumAllTaxAmt}`,
            moiAmt: `${element.moiAmt}`,
            netTaxAmt: `${element.netTaxAmt}`,
          })
          i++;
        });
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }
}

class AppState {
  Ta0301: {
    ta0301: Ta0301,
    listFormTsNumber: ListFormTsNumber,
    pathTsSelectReducer: PathTsSelect
  }
}
