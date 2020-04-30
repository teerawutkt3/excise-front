import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { MessageService } from 'services/message.service';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { ResponseData } from 'models/response-data.model';
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs/internal/Observable';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0105"
}

@Component({
  selector: 'app-ta030105',
  templateUrl: './ta030105.component.html',
  styleUrls: ['./ta030105.component.css']
})
export class Ta030105Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taFormTS0105: FormGroup;
  constructor(
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
  ) {
    this.setTaFormTS0105();
  }

  // =============== Initial setting ================
  ngOnInit() {

    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taFormTS0105.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0105)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taFormTS0105.get('formTsNumber').value))
        this.getFormTs(this.taFormTS0105.get('formTsNumber').value);
    });
  }
  ngOnDestroy(): void {

    this.dataStore.unsubscribe();
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.   
    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', '');
    this.callCalendarDefault('calendarRefDocDate', 'refDocDate', 'date', '');
    this.callCalendarDefault('calendarCaseDate', 'caseDate', 'date', '');
    this.callCalendarDefault('calendarCaseTime', 'caseTime', 'time', 'เวลา');
    this.callCalendarDefault('calendarDestDate', 'destDate', 'date', '');
    this.callCalendarDefault('calendarDestTime', 'destTime', 'time', 'เวลา');
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.taFormTS0105.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  clear(e) {
    this.taFormTS0105.reset();
  }
  setTaFormTS0105() {
    this.taFormTS0105 = this.fb.group({
      formTsNumber: ["",],
      bookNumber1: ["",],
      bookNumber2: ["",],
      officeName: ["",],
      docDate: ["",],
      docDear: ["",],
      refBookNumber1: ["",],
      refBookNumber2: ["",],
      refDocDate: ["",],
      refDocSend: ["",],
      caseDate: ["",],
      caseTime: ["",],
      destText: ["",],
      destDate: ["",],
      destTime: ["",],
      signOfficerFullName: ["",],
      signOfficerPosition: ["",],
      otherText: ["",],
      otherPhone: ["",]
    })
  }

  // ================ Action =======================
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res:ResponseData<any>)=>{

          this.messageBar.successModal(res.message);   

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.taFormTS0105.get('formTsNumber').value)
            this.loading = false;
          });
        })                
      }
    }, "ยืนยันการบันทึก")
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.taFormTS0105.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }


  export(e) {
    this.submit = true;
    console.log("export", this.taFormTS0105.value)

    var form = document.createElement("form");
    form.action = URL.EXPORT;
    form.method = "POST";
    form.style.display = "none";
    //  form.target = "_blank";

    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.taFormTS0105.value).toString();
    form.appendChild(jsonInput);
    document.body.appendChild(form);
    form.submit();

  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0105/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taFormTS0105.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          officeName: json.officeName,
          docDate: json.docDate,
          docDear: json.docDear,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: json.refDocDate,
          refDocSend: json.refDocSend,
          caseDate: json.caseDate,
          caseTime: json.caseTime,
          destText: json.destText,
          destDate: json.destDate,
          destTime: json.destTime,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          otherText: json.otherText,
          otherPhone: json.otherPhone,

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

            this.taFormTS0105.get('formTsNumber').patchValue(res.data[0]);
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
}
class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}


