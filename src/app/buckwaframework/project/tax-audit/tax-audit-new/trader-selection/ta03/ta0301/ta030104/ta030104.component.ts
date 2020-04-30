import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { UserModel } from 'models/user.model';
import { AuthService } from 'services/auth.service';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0104"
}

@Component({
  selector: 'app-ta030104',
  templateUrl: './ta030104.component.html',
  styleUrls: ['./ta030104.component.css']
})
export class Ta030104Component implements OnInit {

  formTS0104: FormGroup;
  userProfile: UserModel;

  submit: boolean = false;
  loading: boolean = false;

  pathTs: any;
  dataStore: any;

  listFormTsNumber: ListFormTsNumber;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setFormTS0104();
    this.setUserProfileForm();
  }

  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.formTS0104.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0104.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0104)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0104.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0104.get('formTsNumber').value);
      }
    });
  }

  ngAfterViewInit(): void {
    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', '');
    this.callCalendarDefault('calendarDestDate', 'destDate', 'date', '');
    this.callCalendarDefault('calendarDestTime', 'destTime', 'time', 'เวลา');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setFormTS0104() {
    this.formTS0104 = this.fb.group({
      formTsNumber: [""],
      bookNumber1: [""],
      bookNumber2: [""],
      subject1: [""],
      subject2: [""],
      docDate: [""],
      docTopic: [""],
      docDear: [""],
      docReference: [""],
      docRequire: [""],
      destText: [""],
      destDate: [""],
      destTime: [""],
      docPaper: [""],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      otherText: [""],
      otherPhone: [""]
    })
  }

  setUserProfileForm() {
    this.formTS0104.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.departmentName
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.formTS0104.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  // ============== Action ======================
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0104.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formTS0104.reset();
  }
  export(e) {
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0104.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0104.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0104.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0104/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formTS0104.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          subject1: json.subject1,
          subject2: json.subject2,
          docDate: json.docDate,
          docTopic: json.docTopic,
          docDear: json.docDear,
          docReference: json.docReference,
          docRequire: json.docRequire,
          destText: json.destText,
          destDate: json.destDate,
          destTime: json.destTime,
          docPaper: json.docPaper,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          otherText: json.otherText,
          otherPhone: json.otherPhone
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
            this.formTS0104.get('formTsNumber').patchValue(res.data[0]);
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
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0104.value).toString() }).subscribe((res: ResponseData<any>) => {
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

