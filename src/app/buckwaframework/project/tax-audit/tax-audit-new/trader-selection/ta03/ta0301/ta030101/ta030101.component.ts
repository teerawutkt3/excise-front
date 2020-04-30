import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { UserModel } from 'models/user.model';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import * as TA0301ACTION from "../ta0301.action";
import { Observable } from 'rxjs';



declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0101",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta030101',
  templateUrl: './ta030101.component.html',
  styleUrls: ['./ta030101.component.css']
})
export class Ta030101Component implements OnInit {
  formTS0101: FormGroup
  userProfile: UserModel;

  loading: boolean = false;
  submit: boolean = false;

  pathTs: any;
  dataStore: any;

  listFormTsNumber: ListFormTsNumber;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private authService: AuthService,
    private ta0301Service: Ta0301Service,
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setForm();
    this.setUserProfileForm();
  }

  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.formTS0101.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0101.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0101)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0101.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0101.get('formTsNumber').value);
      }
    });

  }

  ngAfterViewInit(): void {
    this.callCalendarDefault('calendarAnalysisDateStart', 'analysisDateStart', 'date');
    this.callCalendarDefault('calendarAnalysisDateEnd', 'analysisDateEnd', 'date');
    this.callCalendarDefault('calendarSignOfficerDate', 'signOfficerDate', 'date');
    this.callCalendarDefault('calendarSignApprDate', 'signApprDate', 'date');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setForm() {
    this.formTS0101 = this.fb.group({
      formTsNumber: [""],
      newRegId: [""],
      factoryName: [""],
      factoryTypeText: [""],
      factoryAddress: [""],
      analysisDateStart: [""],
      analysisDateEnd: [""],
      analysisData1: [""],
      analysisData2: [""],
      analysisData3: [""],
      analysisData4: [""],
      analysisData5: [""],
      analysisResultDear: [""],
      analysisResultText: [""],
      callAuditFlag: [""],
      otherText: [{ value: "", disabled: true }],
      signOfficerFullName: [""],
      signSupOfficerFullName: [""],
      signOfficerDate: [""],
      approvedFlag: [""],
      signApprOfficerFullName: [""],
      signApprOfficerPosition: [""],
      signApprDate: [""]
    })
  }

  setUserProfileForm() {
    this.formTS0101.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formTS0101.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  // ================ Action ==========================
  disableEnableInput(num: string) {
    if (num === '2') {
      this.formTS0101.get("otherText").enable();
    } else {
      this.formTS0101.get("otherText").disable();
      this.formTS0101.patchValue({
        otherText: '',
      });
    }
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0101.get('newRegId').value)
    let newRegId = this.formTS0101.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }
  //=============================== backend=============================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0101.patchValue({
          factoryName: res.data.facFullname,
          factoryAddress: res.data.facAddress,
          factoryTypeText: res.data.factoryTypeText
        })
        console.log("formTS0101 : ", this.formTS0101.value)
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
        this.loading = true;
        this.saveTs().subscribe((res:ResponseData<any>)=>{

          this.messageBar.successModal(res.message);   

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0101.get('formTsNumber').value)
            this.loading = false;
          });
        })                
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formTS0101.reset();
  }
  export(e) {
    this.loading = true;
    this.saveTs().subscribe((res:ResponseData<any>)=>{
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0101.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0101.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0101.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });  
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0101/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formTS0101.patchValue({
          formTsNumber: json.formTsNumber,
          newRegId: json.newRegId,
          factoryName: json.factoryName,
          factoryTypeText: json.factoryTypeText,
          factoryAddress: json.factoryAddress,
          analysisDateStart: json.analysisDateStart,
          analysisDateEnd: json.analysisDateEnd,
          analysisData1: json.analysisData1,
          analysisData2: json.analysisData2,
          analysisData3: json.analysisData3,
          analysisData4: json.analysisData4,
          analysisData5: json.analysisData5,
          analysisResultDear: json.analysisResultDear,
          analysisResultText: json.analysisResultText,
          callAuditFlag: json.callAuditFlag,
          otherText: json.otherText,
          signOfficerFullName: json.signOfficerFullName,
          signSupOfficerFullName: json.signSupOfficerFullName,
          signOfficerDate: json.signOfficerDate,
          approvedFlag: json.approvedFlag,
          signApprOfficerFullName: json.signApprOfficerFullName,
          signApprOfficerPosition: json.signApprOfficerPosition,
          signApprDate: json.signApprDate,
        })
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
            this.formTS0101.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber ");
        }
      })
    })
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0101.value).toString() }).subscribe((res: ResponseData<any>) => {
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



