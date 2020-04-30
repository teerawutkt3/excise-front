import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { MessageBarService } from 'services/message-bar.service';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { PathTs } from '../path.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/response-data.model';
import { Observable } from 'rxjs/internal/Observable';
import { MessageService } from 'services/message.service';
import * as TA0301ACTION from "../ta0301.action";

declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0303",
}

@Component({
  selector: 'app-ta030303',
  templateUrl: './ta030303.component.html',
  styleUrls: ['./ta030303.component.css']
})
export class Ta030303Component implements OnInit {
  formTS0303: FormGroup
  items: FormArray;

  loading: boolean = false;
  submit: boolean = false;

  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
  ) {
    // =============== Initial setting ==========//
    this.setForm();
  }

  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.formTS0303.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0303.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0303)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0303.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0303.get('formTsNumber').value);
      }
    });
  }
  ngAfterViewInit(): void {
    this.callCalendar('0');
  }
  setForm() {
    this.formTS0303 = this.fb.group({
      formTsNumber: [""],
      taFormTS0303DtlVoList: this.fb.array([this.createListItem()])
    })
  }

  //set oop for dataList
  createListItem(): FormGroup {
    return this.fb.group({
      formTs0303DtlId: [""],
      recNo: [""],
      ownerFullName: [""],
      newRegId: [""],
      factoryTypeText: [""],
      reqDocNo: [""],
      reqDocDate: [""],
      informDocNo: [""],
      informDocDate: [""],
      callDocNo: [""],
      callDocDate: [""],
      auditDateStart: [""],
      auditDateEnd: [""],
      resultDocNo: [""],
      resultDocDate: [""],
      resultTaxAmt: [""],
      resultFineAmt: [""],
      resultExtraAmt: [""],
      resultMoiAmt: [""],
      resultNetTaxAmt: [""],
      assessmentAmt: [""],
      officerFullName: [""],
      officerDate: [""],
      officerComment: [""]
    });
  }
  //=============================== callCalendar =============================
  callCalendar(idx): void {

    $("#reqDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('reqDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#informDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('informDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#callDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('callDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#auditDateStart" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('auditDateStart').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#auditDateEnd" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('auditDateEnd').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#resultDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('resultDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#officerDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.at(idx).get('officerDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

  }

  //=============================== action=============================
  addListItem(): void {
    this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
    this.items.push(this.createListItem());
    console.log("addItem :", this.items.controls);
    setTimeout(() => {
      this.callCalendar(this.items.controls.length - 1);
    }, 50);
  }
  removeListItem(idx): void {
    console.log("removeItem  idx :", idx);
    this.items.removeAt(idx)
  }

  clearItem() {
    this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createListItem());
  }
  //=============================== backend=============================
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formTS0303.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS0303.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  clear(e) {
    this.formTS0303.reset();
    this.clearItem();
  }
  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formTS0303.get('formTsNumber').value)

        console.log("export : ", this.formTS0303.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0303.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      console.log('json : ', JSON.stringify(this.formTS0303.value).toString())
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0303.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
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
            this.formTS0303.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber");
        }
      })
    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0303/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS0303.patchValue({
          formTsNumber: json.formTsNumber,
        })

        this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS0303DtlVoList.length; i++) {
          this.items.push(this.createListItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0303DtlVoList.length; i++) {
            console.log("callListCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0303DtlVoList.forEach(element => {
            this.items = this.formTS0303.get('taFormTS0303DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0303DtlId: `${element.formTs0303DtlId}`,
              recNo: `${element.recNo}`,
              ownerFullName: `${element.ownerFullName}`,
              newRegId: `${element.newRegId}`,
              factoryTypeText: `${element.factoryTypeText}`,
              reqDocNo: `${element.reqDocNo}`,
              reqDocDate: `${element.reqDocDate}`,
              informDocNo: `${element.informDocNo}`,
              informDocDate: `${element.informDocDate}`,
              callDocNo: `${element.callDocNo}`,
              callDocDate: `${element.callDocDate}`,
              auditDateStart: `${element.auditDateStart}`,
              auditDateEnd: `${element.auditDateEnd}`,
              resultDocNo: `${element.resultDocNo}`,
              resultDocDate: `${element.resultDocDate}`,
              resultTaxAmt: `${element.resultTaxAmt}`,
              resultFineAmt: `${element.resultFineAmt}`,
              resultExtraAmt: `${element.resultExtraAmt}`,
              resultMoiAmt: `${element.resultMoiAmt}`,
              resultNetTaxAmt: `${element.resultNetTaxAmt}`,
              assessmentAmt: `${element.assessmentAmt}`,
              officerFullName: `${element.officerFullName}`,
              officerDate: `${element.officerDate}`,
              officerComment: `${element.officerComment}`
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

}
class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}
