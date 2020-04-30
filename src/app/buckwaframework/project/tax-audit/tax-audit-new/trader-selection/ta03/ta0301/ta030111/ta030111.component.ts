import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import { Utils } from 'helpers/utils';
import { Ta0301Service } from '../ts0301.service';
import { PathTs } from '../path.model';
import * as TA0301ACTION from "../ta0301.action";
import { Observable } from 'rxjs';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0111",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta030111',
  templateUrl: './ta030111.component.html',
  styleUrls: ['./ta030111.component.css']
})
export class Ta030111Component implements OnInit {

  text = "ขอรับรองว่า ได้ตรวจสอบจำนวนบัญชีและเอกสารที่ส่งมอบแก่พนักงานเจ้าหน้าที่แล้ว" +
    "เห็นว่าถูกต้อง ครบถ้วนตามจำนวนที่กล่าวข้างต้นและจะรีบติดต่อขอรับคืนภายในกำหนดเวลาสามสิบวัน" +
    "นับแต่วันที่ได้รับแจ้งจากพนักงานเจ้าหน้าที่ให้มารับคืน หากพ้นกำหนดเวลาดังกล่าวแล้ว ให้ถือว่าพนักงานเจ้าหน้าที่" +
    "ไม่ต้องรับผิดชอบในการสูญหายบกพร่องเกี่ยวกับบัญชีและเอกสารต่าง ๆ ดังกล่าวแต่ประการใด" +
    "และข้าพเจ้ายินยอมให้พนักงานเจ้าหน้าที่ดังกล่าวพิจารณาดำเนินการกับบัญชีและเอกสารนั้นตามที่ เห็นสมควรต่อไป";

  formTS0111: FormGroup;
  taFormTS0111DtlVoList: FormArray;

  loading: boolean = false;
  submit: boolean = false;

  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;

  provinceList: ProvinceList[];
  amphurList: AmphurList[];
  amphurListFilter: AmphurList[];
  districtList: DistrictList[];
  districtListFilter: DistrictList[];

  provinceStore: any;
  amphurStore: any;
  districtStore: any;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ta0301Service: Ta0301Service,
  ) {
    // ================ Initial setting =============
    this.setForm();
    // disable deliverOther
    this.deliverPositionClick('0');
    // disable authPositionOther
    this.authPositionClick('0');
  }

  ngOnInit() {
    this.resetRadio();
    console.log("ngOnInit formGroup : ", this.formTS0111.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0111.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0111)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0111.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0111.get('formTsNumber').value);
      }
    });
  }

  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', '');
    this.callCalendarDefault('calendarDocTime', 'docTime', 'time', 'เวลา');
    this.callCalendarDefault('calendarRefDocDate', 'refDocDate', 'date', '');
    this.callCalendarDefault('calendarAuthDate', 'authDate', 'date', '');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  setForm() {
    this.formTS0111 = this.fb.group({
      formTsNumber: ["", Validators.required],
      docPlace: ["", Validators.required],
      docDate: ["", Validators.required],
      docTime: ["", Validators.required],
      officerFullName: ["", Validators.required],
      officerPosition: ["", Validators.required],
      factoryName: ["", Validators.required],
      newRegId: ["", Validators.required],
      factoryType: ["", Validators.required],
      facAddrNo: ["", Validators.required],
      facMooNo: ["", Validators.required],
      facSoiName: ["", Validators.required],
      facThnName: ["", Validators.required],
      facTambolName: ["", Validators.required],
      facAmphurName: ["", Validators.required],
      facProvinceName: ["", Validators.required],
      facZipCode: ["", Validators.required],
      deliverFullName: ["", Validators.required],
      deliverPosition: ["", Validators.required],
      deliverOther: ["", Validators.required],
      refBookNumber1: ["", Validators.required],
      refBookNumber2: ["", Validators.required],
      refDocDate: ["", Validators.required],
      taFormTS0111DtlVoList: this.fb.array([this.createTaFormTS0111DtlVoList()]),
      signAuthFullName1: ["", Validators.required],
      signWitnessFullName1: ["", Validators.required],
      signWitnessFullName2: ["", Validators.required],
      authFullName1: ["", Validators.required],
      signAuthFullName2: ["", Validators.required],
      signWitnessFullName3: ["", Validators.required],
      signWitnessFullName4: ["", Validators.required],
      authFullName2: ["", Validators.required],
      authPosition: ["", Validators.required],
      authPositionOther: ["", Validators.required],
      authFrom: ["", Validators.required],
      authDate: ["", Validators.required],
      signAuthFullName3: ["", Validators.required],
      signAuthFullName4: ["", Validators.required],
      signWitnessFullName5: ["", Validators.required],
      signWitnessFullName6: ["", Validators.required]
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.formTS0111.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  createTaFormTS0111DtlVoList(): FormGroup {
    return this.fb.group({
      formTs0111DtlId: ["", Validators.required],
      recNo: ["", Validators.required],
      docName: ["", Validators.required],
      docQty: ["", Validators.required],
      docComment: ["", Validators.required]
    });
  }

  addTaFormTS0111DtlVoList(): void {
    this.taFormTS0111DtlVoList = this.formTS0111.get("taFormTS0111DtlVoList") as FormArray;
    this.taFormTS0111DtlVoList.push(this.createTaFormTS0111DtlVoList());
  }

  removeTaFormTS0111DtlVoList(index: number): void {
    this.taFormTS0111DtlVoList = this.formTS0111.get("taFormTS0111DtlVoList") as FormArray;
    this.taFormTS0111DtlVoList.removeAt(index);
  }
  clearTaFormTS0111DtlVoList() {
    this.taFormTS0111DtlVoList = this.formTS0111.get('taFormTS0111DtlVoList') as FormArray;
    this.taFormTS0111DtlVoList.controls.splice(0, this.taFormTS0111DtlVoList.controls.length)
    this.taFormTS0111DtlVoList.push(this.createTaFormTS0111DtlVoList());
  }

  callSearch(data: any[], className: string, fieldName: string, formName: string) {
    const FAC_PROVINCE_SEARCH = "facProvinceSearch";
    const FAC_AMPHUR_SEARCH = "facAmphurSearch";
    // Clears value from cache, if no parameter passed clears all cache
    $(`.${className}`).search('clear cache');

    $(`.${className}`)
      .search({
        source: data,
        showNoResults: false,
        searchFields: [`${fieldName}`],
        fields: {
          // results: 'items',
          title: `${fieldName}`,
        },
        onSelect: (result, response) => {
          this.formTS0111.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              this.amphurListFilter = this.amphurList.filter(({ provinceId }) => {
                return provinceId == result.provinceId;
              });
              // reset amphur and tambol when province new select
              this.formTS0111.get('facAmphurName').reset();
              this.formTS0111.get('facTambolName').reset();

              this.callSearch(this.amphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
              break;
            // amphur search TODO filter district
            case FAC_AMPHUR_SEARCH:
              this.districtListFilter = [];
              this.districtListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
                return provinceId == result.provinceId && amphurId == result.amphurId;
              });
              // reset tambol when amphur new select
              this.formTS0111.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  // ============= Action ===================
  deliverPositionClick(number: string) {
    this.formTS0111.get('deliverPosition').patchValue(number);
    if ('5' == number) {
      this.formTS0111.get('deliverOther').enable();
    } else {
      this.formTS0111.get('deliverOther').disable();
    }
  }

  authPositionClick(number: string) {
    this.formTS0111.get('authPosition').patchValue(number);
    if ('4' == number) {
      this.formTS0111.get('authPositionOther').enable();
    } else {
      this.formTS0111.get('authPositionOther').disable();
    }
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS0111.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก");
  }
  clear(e) {
    this.formTS0111.reset();
    this.clearTaFormTS0111DtlVoList();
    this.resetRadio();
  }
  export(e) {
    //add recNo in taFormTS0111DtlVoList
    for (let index = 0; index < this.formTS0111.get('taFormTS0111DtlVoList').value.length; index++) {
      this.formTS0111.get('taFormTS0111DtlVoList').get(index.toString()).get('recNo').patchValue(index + 1);
    }

    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0111.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;

        var form = document.createElement("form");
        form.method = "POST";
        // form.target = "_blank";
        form.action = URL.EXPORT;

        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0111.value);
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      });
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
            this.formTS0111.get('formTsNumber').patchValue(res.data[0]);
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

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0111.get('newRegId').value)
    let newRegId = this.formTS0111.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  resetRadio() {
    setTimeout(() => {
      $('input[name="factoryType"]').prop('checked', false);
      $('input[name="deliverPosition"]').prop('checked', false);
      $('input[name="authPosition"]').prop('checked', false);
    }, 100);
  }
  // ================ call back-end =================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0111.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
          factoryType: res.data.factoryType
        })
        console.log("formTS0111 : ", this.formTS0111.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0111/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let json = JSON.parse(res.data);
        this.formTS0111.patchValue({
          formTsNumber: json.formTsNumber,
          docPlace: json.docPlace,
          docDate: json.docDate,
          docTime: json.docTime,
          officerFullName: json.officerFullName,
          officerPosition: json.officerPosition,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          factoryType: json.factoryType,
          facAddrNo: json.facAddrNo,
          facMooNo: json.facMooNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          deliverFullName: json.deliverFullName,
          deliverPosition: json.deliverPosition,
          deliverOther: json.deliverOther,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: json.refDocDate,
          signAuthFullName1: json.signAuthFullName1,
          signWitnessFullName1: json.signWitnessFullName1,
          signWitnessFullName2: json.signWitnessFullName2,
          authFullName1: json.authFullName1,
          signAuthFullName2: json.signAuthFullName2,
          signWitnessFullName3: json.signWitnessFullName3,
          signWitnessFullName4: json.signWitnessFullName4,
          authFullName2: json.authFullName2,
          authPosition: json.authPosition,
          authPositionOther: json.authPositionOther,
          authFrom: json.authFrom,
          authDate: json.authDate,
          signAuthFullName3: json.signAuthFullName3,
          signAuthFullName4: json.signAuthFullName4,
          signWitnessFullName5: json.signWitnessFullName5,
          signWitnessFullName6: json.signWitnessFullName6
        })
        this.taFormTS0111DtlVoList = this.formTS0111.get("taFormTS0111DtlVoList") as FormArray;
        this.taFormTS0111DtlVoList.controls = [];

        console.log("json ==> loop", this.taFormTS0111DtlVoList.value)
        //==> add items
        for (let i = 0; i < json.taFormTS0111DtlVoList.length; i++) {
          this.taFormTS0111DtlVoList.push(this.createTaFormTS0111DtlVoList());
          console.log('add taFormTS0111DtlVoList ==> i : ', i);
        }
        let i = 0;
        setTimeout(() => {
          json.taFormTS0111DtlVoList.forEach(element => {
            this.taFormTS0111DtlVoList = this.formTS0111.get('taFormTS0111DtlVoList') as FormArray;
            this.taFormTS0111DtlVoList.at(i).patchValue({
              formTs0111DtlId: `${element.formTs0111DtlId}`,
              recNo: `${element.recNo}`,
              docName: `${element.docName}`,
              docQty: `${element.docQty}`,
              docComment: `${element.docComment}`,
            })
            i++;
          });
          console.log(json.taFormTS0111DtlVoList);

        }, 100);

        // set checkbox
        setTimeout(() => {
          $('#factoryType').prop('checked', false);
          $(`#factoryType${json.factoryType}`).prop('checked', true);
          $('#deliverPosition').prop('checked', false);
          $(`#deliverPosition${json.deliverPosition}`).prop('checked', true);
          $('#authPosition').prop('checked', false);
          $(`#authPosition${json.authPosition}`).prop('checked', true);
        }, 100);
        // call new search
        // find amphur for get provinceId and amphurId
        var amphur = this.amphurList.find((element) => {
          return element.amphurName == json.facAmphurName;
        });
        if (Utils.isNotNull(amphur)) {
          // filter amphur and district
          this.amphurListFilter = this.amphurList.filter(({ provinceId }) => {
            return provinceId == amphur.provinceId;
          });
          this.districtListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
            return provinceId == amphur.provinceId && amphurId == amphur.amphurId;
          });
          // call search after filter amphur and district
          this.callSearch(this.amphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
          this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
        }

        console.log("taFormTS0120 : ", this.formTS0111.value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0111.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }

  getProvinceList() {
    this.provinceStore = this.store.select(state => state.Ta0301.proviceList).subscribe(datas => {
      this.provinceList = [];
      this.provinceList = datas;
      this.callSearch(this.provinceList, 'facProvinceSearch', 'provinceName', 'facProvinceName');
    });
  }

  getAmphurList() {
    this.amphurStore = this.store.select(state => state.Ta0301.amphurList).subscribe(datas => {
      this.amphurList = [];
      this.amphurList = datas;
      this.callSearch(this.amphurList, 'facAmphurSearch', 'amphurName', 'facAmphurName');
    });
  }

  getDistrictList() {
    this.districtStore = this.store.select(state => state.Ta0301.districtList).subscribe(datas => {
      this.districtList = [];
      this.districtList = datas;
      this.callSearch(this.districtList, 'facTambolSearch', 'districtName', 'facTambolName');
    });
  }

}

class AppState {
  Ta0301: {
    ta0301: Ta0301,
    proviceList: ProvinceList[],
    amphurList: AmphurList[],
    districtList: DistrictList[]
  }
}
