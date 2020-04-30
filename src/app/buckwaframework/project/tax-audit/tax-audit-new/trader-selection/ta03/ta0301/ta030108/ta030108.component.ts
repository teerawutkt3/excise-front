import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import * as moment from 'moment';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { MessageBarService } from 'services/message-bar.service';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { PathTs } from '../path.model';
import * as TA0301ACTION from "../ta0301.action";
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Observable } from 'rxjs/internal/Observable';
declare var $: any;
@Component({
  selector: 'app-ta030108',
  templateUrl: './ta030108.component.html',
  styleUrls: ['./ta030108.component.css']
})
export class Ta030108Component implements OnInit {

  add: number;
  formTS0108: FormGroup;
  taFormTS0108DtlVoList: FormArray;
  items: FormArray;

  submit: boolean = false;
  loading: boolean = false;
  auditDateStart: string = '';
  auditDateEnd: string = '';
  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;
  beans: any;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
  ) {
    this.createFormGroup()

  }
  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();
  }

  ngOnInit() {
    console.log("ngOnInit formGroup : ", this.formTS0108.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0108.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0108)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0108.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0108.get('formTsNumber').value);
      }
    });
  }
  createFormGroup() {
    this.formTS0108 = this.fb.group({
      formTsNumber: [''],
      taFormTS0108DtlVoList: this.fb.array([this.createItem()]),

    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      recNo: ["", Validators.required],
      auditDate: ["", Validators.required],
      officerFullName: ["", Validators.required],
      officerPosition: ["", Validators.required],
      auditTime: ["", Validators.required],
      auditDest: ["", Validators.required],
      auditTopic: ["", Validators.required],
      approvedAck: ["", Validators.required],
      officerAck: ["", Validators.required],
      // auditResultDocNo: ["", Validators.required],
      auditResultDate: ["", Validators.required],
      auditComment: ["", Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.callCalendar('0');
  }
  callCalendar(idx): void {
    $("#auditDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
        this.items.at(idx).get('auditDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
    $("#auditResultDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
        this.items.at(idx).get('auditResultDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
  }

  clearItem() {
    console.log('this.formGroup.value', this.formTS0108.value)
    this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createItem());

    setTimeout(() => {
      console.log('this.formTS0108.get(taFormTS0108DtlVoList).value', this.formTS0108.get('taFormTS0108DtlVoList').value)
      for (let i = 0; i < this.formTS0108.get('taFormTS0108DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callCalendar(i)
      }
    }, 50);
  }
  addItem(): void {
    this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
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

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res:ResponseData<any>)=>{

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0108.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0108.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }
  clear(e) {
    this.formTS0108.reset();
    this.clearItem();
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0108/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS0108.patchValue({
          formTsNumber: json.formTsNumber,

        })

        this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items
        for (let i = 0; i < json.taFormTS0108DtlVoList.length; i++) {
          this.items.push(this.createItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0108DtlVoList.length; i++) {
            console.log("callCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0108DtlVoList.forEach(element => {
            this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0108DtlId: `${element.formTs0108DtlId}`,
              recNo: `${element.recNo}`,
              auditDate: `${element.auditDate}`,
              officerPosition: `${element.officerPosition}`,
              auditDest: `${element.auditDest}`,
              auditTopic: `${element.auditTopic}`,
              approvedAck: `${element.approvedAck}`,
              officerAck: `${element.officerAck}`,
              auditResultDate: `${element.auditResultDate}`,
              auditComment: `${element.auditComment}`,
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

            this.formTS0108.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 08");
        }
      })
    })
  }

  exportFile = e => {
    console.log(this.formTS0108.value);

    const URL = "ta/report/pdf/ta-form-ts0108";
    var form = document.createElement("form");
    form.method = "POST";
    // form.target = "_blank";
    form.action = AjaxService.CONTEXT_PATH + URL;

    form.style.display = "none";
    var jsonInput = document.createElement("input");
    const data: string = JSON.stringify(this.formTS0108.value);
    console.log(data);

    jsonInput.name = "json";
    jsonInput.value = data;
    form.appendChild(jsonInput);

    document.body.appendChild(form);
    form.submit();
  }

}
class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}
