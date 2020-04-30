import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { ListFormTsNumber, Ta0301 } from '../../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../../ts0301.service';
import { Utils } from 'helpers/utils';
import { PathTs } from '../../path.model';
import * as TA0301ACTION from "../../ta0301.action";
import { UserModel } from 'models/user.model';
import { Observable } from 'rxjs';

declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts01141",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta03011401',
  templateUrl: './ta03011401.component.html',
  styleUrls: ['./ta03011401.component.css']
})
export class Ta03011401Component implements OnInit {

  formTS01141: FormGroup
  taFormTS01141VoList: FormArray;
  userProfile: UserModel;

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
    console.log("ngOnInit formGroup : ", this.formTS01141.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {  
      this.formTS01141.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;   
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts01141)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS01141.get('formTsNumber').value)) {
        this.getFormTs(this.formTS01141.get('formTsNumber').value);
      }
    });
  }

  ngAfterViewInit(): void {
    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', '');
    this.callCalendarDefault('calendarAuditDateStart', 'auditDateStart', 'date', '');
    this.callCalendarDefault('calendarAuditDateEnd', 'auditDateEnd', 'date', '');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setForm() {
    this.formTS01141 = this.fb.group({
      formTsNumber:[""],
      docDate: [""],
      pageNo: ["0"],
      docDear: [""],
      factoryName: [""],
      factoryTypeText: [""],
      newRegId: [""],
      auditDateStart: [""],
      auditDateEnd: [""],
      auditDesc: [""],
      taFormTS01141VoList: this.fb.array([])
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.formTS01141.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  // ============= Action ==================
  createTaFormTS01141VoList(): FormGroup {
    return this.fb.group({
      auditDesc: [""],
      pageNo: [""]
    })
  }

  addTaFormTS01141VoList(): void {

    this.taFormTS01141VoList = this.formTS01141.get('taFormTS01141VoList') as FormArray;
    this.taFormTS01141VoList.push(this.createTaFormTS01141VoList());
    let idx = this.taFormTS01141VoList.length - 1;
    this.taFormTS01141VoList.at(idx).get('pageNo').patchValue(this.taFormTS01141VoList.length);
  }


  removeTaFormTS01141VoList(index: number): void {
    this.taFormTS01141VoList = this.formTS01141.get('taFormTS01141VoList') as FormArray;
    this.taFormTS01141VoList.removeAt(index);
  }

  clearTaFormTS01141VoList() {
    this.taFormTS01141VoList = this.formTS01141.get('taFormTS01141VoList') as FormArray;
    this.taFormTS01141VoList.controls.splice(0, this.taFormTS01141VoList.controls.length)
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS01141.get('newRegId').value)
    let newRegId = this.formTS01141.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  //=============================== backend=============================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS01141.patchValue({
          factoryName: res.data.facFullname,
          factoryTypeText: res.data.factoryTypeText
        })
        console.log("formTS01141 : ", this.formTS01141.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formTS01141.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS01141.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  clear(e) {
    this.formTS01141.reset();
    this.clearTaFormTS01141VoList();
  }
  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formTS01141.get('formTsNumber').value)

        console.log("export : ", this.formTS01141.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS01141.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts01141/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS01141.patchValue({
          formTsNumber: json.formTsNumber,
          docDate: json.docDate,
          pageNo: json.pageNo,
          docDear: json.docDear,
          factoryName: json.factoryName,
          factoryTypeText: json.factoryTypeText,
          newRegId: json.newRegId,
          auditDateStart: json.auditDateStart,
          auditDateEnd: json.auditDateEnd,
          auditDesc: json.auditDesc,
        })

        this.taFormTS01141VoList = this.formTS01141.get('taFormTS01141VoList') as FormArray;
        this.taFormTS01141VoList.controls = []
        console.log("json ==> loop", this.taFormTS01141VoList.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS01141VoList.length; i++) {
          this.taFormTS01141VoList.push(this.createTaFormTS01141VoList());
          console.log('add item ==> i : ', i);
        }

        let i = 0;
        setTimeout(() => {
          json.taFormTS01141VoList.forEach(element => {
            this.taFormTS01141VoList = this.formTS01141.get('taFormTS01141VoList') as FormArray;
            this.taFormTS01141VoList.at(i).patchValue({
             // formTs0115DtlId: `${element.formTs0115DtlId}`,
             pageNo: `${element.pageNo}`,
             auditDesc: `${element.auditDesc}`,
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
            this.formTS01141.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 12");
        }
      })
    })
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS01141.value).toString() }).subscribe((res: ResponseData<any>) => {
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
    ta0301: Ta0301
  }
}
