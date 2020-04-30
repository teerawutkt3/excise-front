import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs/internal/Observable';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0116",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta030116',
  templateUrl: './ta030116.component.html',
  styleUrls: ['./ta030116.component.css']
})
export class Ta030116Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taformTS0116: FormGroup;

  constructor(

    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
  ) {
    this.setTaFormTS0116();
  }

  // ================= Initial setting ===================
  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.taformTS0116.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taformTS0116.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0116)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taformTS0116.get('formTsNumber').value)) {
        this.getFormTs(this.taformTS0116.get('formTsNumber').value);
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.   
    this.callCalendarDefault('calendarRequestDate', 'requestDate', 'date');
    this.callCalendarDefault('calendarSignHeadOfficerDate', 'signHeadOfficerDate', 'date');
    this.callCalendarDefault('calendarSignApproverDate', 'signApproverDate', 'date');

  }
  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taformTS0116.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.taformTS0116.get('newRegId').value)
    let newRegId = this.taformTS0116.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taformTS0116.patchValue({
          factoryName1: res.data.facFullname,
          factoryName2: res.data.facFullname,
          factoryType: res.data.factoryType
        })
        console.log("formTS0116 : ", this.taformTS0116.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }

  setTaFormTS0116() {
    this.taformTS0116 = this.fb.group({
      formTsNumber: ["",],
      docText: ["",],
      docDear: ["",],
      factoryName2: ["",],
      newRegId: ["",],
      requestDate: ["",],
      requestReason: ["",],
      requestDesc: ["",],
      fineNoFlag: ["",],
      factoryType: [""],
      factoryName1: ["",],
      findReduceFlag: ["",],
      finePercent: ["",],
      extraNoFlag: ["",],
      extraPercent: ["",],
      beforeTaxAmt: ["",],
      beforeFinePercent: ["",],
      beforeFineAmt: ["",],
      beforeExtraAmt: ["",],
      beforeMoiAmt: ["",],
      beforeSumAmt: ["",],
      afterTaxAmt: ["",],
      afterFinePercent: ["",],
      afterFineAmt: ["",],
      afterExtraAmt: ["",],
      afterMoiAmt: ["",],
      afterSumAmt: ["",],
      signOfficerFullName: ["",],
      signOfficerPosition: ["",],
      headOfficerComment: ["",],
      signHeadOfficerFullName: ["",],
      signHeadOfficerPosition: ["",],
      signHeadOfficerDate: ["",],
      approverComment: ["",],
      signApproverFullName: ["",],
      signApproverPosition: ["",],
      signApproverDate: ["",],
      requestTypeExcept: ["N",],
      requestTypeReduce: ["N",],
      requestTypeFineAmt: ["N",],
      requestTypeExtraAmt: ["N",],
      fineExceptAmtFlag: ["N",],
      fineReduceAmtFlag: ["N",],
      extraReduceAmtFlag: ["N",]
    })
  }

  onChangeCheck(name: string, event) {
    if (event.target.checked) {
      this.taformTS0116.get(`${name}`).patchValue('Y');

    } else {
      this.taformTS0116.get(`${name}`).patchValue('N');
    }
    console.log(this.taformTS0116.value);

  }





  export(e) {
    this.submit = true;
    console.log("export", this.taformTS0116.value)

    var form = document.createElement("form");
    form.action = URL.EXPORT;
    form.method = "POST";
    form.style.display = "none";
    //  form.target = "_blank";

    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.taformTS0116.value).toString();
    form.appendChild(jsonInput);
    document.body.appendChild(form);
    form.submit();

  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.taformTS0116.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.taformTS0116.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0116/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taformTS0116.patchValue({
          formTsNumber: json.formTsNumber,
          docText: json.docText,
          docDear: json.docDear,
          factoryName1: json.factoryName1,
          factoryName2: json.factoryName2,
          factoryType: json.factoryType,
          newRegId: json.newRegId,
          requestDate: json.requestDate,
          requestReason: json.requestReason,
          requestDesc: json.requestDesc,
          fineNoFlag: json.fineNoFlag,
          finePercent: json.finePercent,
          extraNoFlag: json.extraNoFlag,
          extraPercent: json.extraPercent,
          beforeTaxAmt: json.beforeTaxAmt,
          beforeFinePercent: json.beforeFinePercent,
          beforeFineAmt: json.beforeFineAmt,
          beforeExtraAmt: json.beforeExtraAmt,
          beforeMoiAmt: json.beforeMoiAmt,
          beforeSumAmt: json.beforeSumAmt,
          afterTaxAmt: json.afterTaxAmt,
          afterFinePercent: json.afterFinePercent,
          afterFineAmt: json.afterFineAmt,
          afterExtraAmt: json.afterExtraAmt,
          afterMoiAmt: json.afterMoiAmt,
          afterSumAmt: json.afterSumAmt,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          headOfficerComment: json.headOfficerComment,
          signHeadOfficerFullName: json.signHeadOfficerFullName,
          signHeadOfficerPosition: json.signHeadOfficerPosition,
          signHeadOfficerDate: json.signHeadOfficerDate,
          approverComment: json.approverComment,
          signApproverFullName: json.signApproverFullName,
          signApproverPosition: json.signApproverPosition,
          signApproverDate: json.signApproverDates,
          requestTypeExcept: json.requestTypeExcept,
          requestTypeReduce: json.requestTypeReduce,
          requestTypeFineAmt: json.requestTypeFineAmt,
          requestTypeExtraAmt: json.requestTypeExtraAmt,
          fineExceptAmtFlag: json.fineExceptAmtFlag,
          fineReduceAmtFlag: json.fineReduceAmtFlag,
          extraReduceAmtFlag: json.extraReduceAmtFlag,

        })
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }
  ngOnDestroy(): void {

    this.dataStore.unsubscribe();
  }
  clear(e) {
    this.taformTS0116.reset();
  }

  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doGet(`ta/report/form-ts-number/${this.pathTs}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }


          if (res.data.length != 0) {

            this.taformTS0116.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 19");
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
