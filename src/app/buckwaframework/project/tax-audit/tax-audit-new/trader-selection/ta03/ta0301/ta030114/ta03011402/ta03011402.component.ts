import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormArray, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { ListFormTsNumber, Ta0301 } from '../../ta0301.model';
import { Store } from '@ngrx/store';
import { MessageBarService } from 'services/message-bar.service';
import { Ta0301Service } from '../../ts0301.service';
import { PathTs } from '../../path.model';
import { Utils } from 'helpers/utils';
import { MessageService } from 'services/message.service';
import * as TA0301ACTION from "../../ta0301.action";
import { ResponseData } from 'models/response-data.model';
import { Observable } from 'rxjs/internal/Observable';
declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts01142",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta03011402',
  templateUrl: './ta03011402.component.html',
  styleUrls: ['./ta03011402.component.css']
})

export class Ta03011402Component implements OnInit {

  items: FormArray;
  submit: boolean = false;
  loading: boolean = false;
  auditDateStart: string = '';
  auditDateEnd: string = '';
  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;
  formTS0142: FormGroup;
  taFormTS01142DtlVoList: FormArray;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,

    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
  ) {

    this.createFormGroup();
  }

  ngOnInit() {

    console.log("ngOnInit formGroup : ", this.formTS0142.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0142.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts01142)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0142.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0142.get('formTsNumber').value);
      }
    });


  }
  createFormGroup() {
    this.formTS0142 = this.fb.group({
      formTsNumber: [''],
      ownerFullName: ["", Validators.required],
      factoryType: ["", Validators.required],
      factoryName: ["", Validators.required],
      auditDateStart: ["", Validators.required],
      auditDateEnd: ["", Validators.required],
      dutyTypeText: ["", Validators.required],
      newRegId: ["", Validators.required],
      extraAmtDate: ["", Validators.required],
      signOwnerFullName: ["", Validators.required],
      signOfficerFullName: ["", Validators.required],

      taFormTS01142DtlVoList: this.fb.array([this.createItem()]),
    })
  }
  // setForm() {
  //   this.formTS0142 = this.fb.group({
  //     taFormTS01142DtlVoList: this.fb.array([]),
  //   });
  //   this.addItem();
  // }

  createItem(): FormGroup {
    return this.fb.group({
      formTs01142DtlId: [''],
      recNo: [''],
      recDate: [''],
      dutyTypeText: [''],
      valueFromAudit: [''],
      taxRate: [''],
      auditTaxAmt: [''],
      paidTaxAmt: [''],
      addTaxAmt: [''],
      addFineAmt: [''],
      addExtraAmt: [''],
      addSumTaxAmt: [''],
      addMoiAmt: [''],
      addSumAllTaxAmt: [''],
      addMonthNum: [''],

    });
  }


  addItem(): void {
    this.items = this.formTS0142.get('taFormTS01142DtlVoList') as FormArray;
    this.items.push(this.createItem());
    console.log("addItem :", this.items.controls);
    setTimeout(() => {
      this.callCalendar(this.items.controls.length - 1);
    }, 50);
  }
  removeItem(idx): void {
    console.log("removeItem  idx :", idx);
    this.items.removeAt(idx)
  }
  clearItem() {
    this.items = this.formTS0142.get('taFormTS01142DtlVoList') as FormArray;
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
        this.formTS0142.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  ngAfterViewInit(): void {
    this.callCalendar('0');
    this.callCalendarDefault('calendarAuditDateStart', 'auditDateStart', 'date');
    this.callCalendarDefault('calendarAuditDateEnd', 'auditDateEnd', 'date');
    this.callCalendarDefault('calendarExtraAmtDate', 'extraAmtDate', 'date');
  }
  callCalendar(idx): void {
    $("#docDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0142.get('taFormTS01142DtlVoList') as FormArray;
        this.items.at(idx).get('recDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
  }



  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formTS0142.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS0142.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0142.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }
  clear(e) {
    this.formTS0142.reset();
    this.clearItem();
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts01142/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS0142.patchValue({
          formTsNumber: json.formTsNumber,
          ownerFullName: json.ownerFullName,
          factoryType: json.factoryType,
          factoryName: json.factoryName,
          auditDateStart: json.auditDateStart,
          auditDateEnd: json.auditDateEnd,
          dutyTypeText: json.dutyTypeText,
          newRegId: json.newRegId,
          extraAmtDate: json.extraAmtDate,
          signOwnerFullName: json.signOwnerFullName,
          signOfficerFullName: json.signOfficerFullName,
        })

        this.items = this.formTS0142.get('taFormTS01142DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS01142DtlVoList.length; i++) {
          this.items.push(this.createItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS01142DtlVoList.length; i++) {
            console.log("callCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS01142DtlVoList.forEach(element => {
            this.items = this.formTS0142.get('taFormTS01142DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs01142DtlId: `${element.formTs01142DtlId}`,
              dutyTypeText: `${element.dutyTypeText}`,
              valueFromAudit: `${element.valueFromAudit}`,
              taxRate: `${element.taxRate}`,
              auditTaxAmt: `${element.auditTaxAmt}`,
              paidTaxAmt: `${element.paidTaxAmt}`,
              addTaxAmt: `${element.addTaxAmt}`,
              addFineAmt: `${element.addFineAmt}`,
              addExtraAmt: `${element.addExtraAmt}`,
              addSumTaxAmt: `${element.addSumTaxAmt}`,
              addMoiAmt: `${element.addMoiAmt}`,
              addSumAllTaxAmt: `${element.addSumAllTaxAmt}`,
              addMonthNum: `${element.addMonthNum}`,
            })
            i++;
          });
        }, 100);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }
  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doGet(`ta/report/form-ts-number/${this.pathTs}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }
          if (res.data.length != 0) {
            this.formTS0142.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 142");
        }
      })
    })
  }
  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0142.get('newRegId').value)
    let newRegId = this.formTS0142.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0142.patchValue({
          factoryName: res.data.facFullname,
          factoryType: res.data.factoryType
        })
        console.log("formTS01142: ", this.formTS0142.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }
  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formTS0142.get('formTsNumber').value)

        console.log("export : ", this.formTS0142.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0142.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }

  ngOnDestroy(): void {

    this.dataStore.unsubscribe();
  }

}
class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}


