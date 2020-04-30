import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { UserModel } from 'models/user.model';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import * as TA0301ACTION from "../ta0301.action";
import { Observable } from 'rxjs';

declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0102",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta030102',
  templateUrl: './ta030102.component.html',
  styleUrls: ['./ta030102.component.css']
})
export class Ta030102Component implements OnInit {

  formGroup: FormGroup;
  userProfile: UserModel;

  submit: boolean = false;
  loading: boolean = false;

  pathTs: any;
  dataStore: any;

  listFormTsNumber: ListFormTsNumber;

  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private authService: AuthService,
    private store: Store<AppState>,
    private ta0301Service: Ta0301Service,
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setForm();
    this.setUserProfileForm();
  }

  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.formGroup.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0102)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formGroup.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup.get('formTsNumber').value);
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.callCalendarDefault("calendarAuditDateStart", "auditDateStart", "date");
    this.callCalendarDefault("calendarAuditDateEnd", "auditDateEnd", "date");
    this.callCalendarDefault("calendarSignOfficerDate", "signOfficerDate", "date");
    this.callCalendarDefault("calendarSignRegDate", "signRegDate", "date");
    this.callCalendarDefault("calendarSignComdDate", "signComdDate", "date");
    this.callCalendarDefault("calendarSignFinanceDate", "signFinanceDate", "date");
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }


  setForm() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      bookNumber1: [''],
      bookNumber2: [''],
      docDear: [''],
      docFrom: [''],
      docText1: [''],
      companyType: [''],
      factoryName: [''],
      newRegId: [''],
      factoryAddress: [''],
      factoryTypeText: [''],
      auditDateStart: [''],
      auditDateEnd: [''],
      auditCase: [''],
      signOfficerFullName: [''],
      signOfficerPosition: [''],
      signOfficerDate: [''],
      regDear: [''],
      regText: [''],
      signRegFullName: [''],
      signRegPosition: [''],
      signRegDate: [''],
      comdTypeFlag: [''],
      signComdFullName: [''],
      signComdPosition: [''],
      signComdDate: [''],
      financeBookNumber1: [''],
      financeBookNumber2: [''],
      financeDear: [''],
      signFinanceFullName: [''],
      signFinancePosition: [''],
      signFinanceDate: [''],
    });
  }

  setUserProfileForm() {
    this.formGroup.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.departmentName
    })
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
  searchNewRegId() {
    console.log("searchNewRegId", this.formGroup.get('newRegId').value)
    let newRegId = this.formGroup.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }


  //=================== backend =======================
  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formGroup.patchValue({
          factoryName: res.data.facFullname,
          factoryAddress: res.data.facAddress,
          companyType: res.data.factoryType
        })
        console.log("formGroup : ", this.formGroup.value)
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

            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          });
        })                
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formGroup.reset();
  }
  export(e) {
    this.loading = true;
    this.saveTs().subscribe((res:ResponseData<any>)=>{
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formGroup.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formGroup.value)

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
      });
    });  
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0102/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docDear: json.docDear,
          docFrom: json.docFrom,
          docText1: json.docText1,
          companyType: json.companyType,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          factoryAddress: json.factoryAddress,
          factoryTypeText: json.factoryTypeText,
          auditDateStart: json.auditDateStart,
          auditDateEnd: json.auditDateEnd,
          auditCase: json.auditCase,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          signOfficerDate: json.signOfficerDate,
          regDear: json.regDear,
          regText: json.regText,
          signRegFullName: json.signRegFullName,
          signRegPosition: json.signRegPosition,
          signRegDate: json.signRegDate,
          comdTypeFlag: json.comdTypeFlag,
          signComdFullName: json.signComdFullName,
          signComdPosition: json.signComdPosition,
          signComdDate: json.signComdDate,
          financeBookNumber1: json.financeBookNumber1,
          financeBookNumber2: json.financeBookNumber2,
          financeDear: json.financeDear,
          signFinanceFullName: json.signFinanceFullName,
          signFinancePosition: json.signFinancePosition,
          signFinanceDate: json.signFinanceDate,

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
            this.formGroup.get('formTsNumber').patchValue(res.data[0]);
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
    ta0301: Ta0301
  }
}
