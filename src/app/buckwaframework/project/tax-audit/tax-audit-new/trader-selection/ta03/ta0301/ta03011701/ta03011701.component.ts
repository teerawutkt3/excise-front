import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import * as moment from 'moment';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts01171",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta03011701',
  templateUrl: './ta03011701.component.html',
  styleUrls: ['./ta03011701.component.css']
})
export class Ta03011701Component implements OnInit {

  taFormTS01171: FormGroup;
  formTsNumber: any;

  submit: boolean = false;
  loading: boolean = false;

  pathTs: any;
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
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
  ) { }

  // ============= Initial setting ===============
  ngOnInit() {
    this.setTaFormTS01171();
    this.resetRadio();
    console.log("ngOnInit formGroup : ", this.taFormTS01171.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taFormTS01171.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts01171)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taFormTS01171.get('formTsNumber').value)) {
        this.getFormTs(this.taFormTS01171.get('formTsNumber').value);
      }
    });

  }

  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', '');
    this.callCalendarDefault('calendarRefDocDate', 'docDate', 'date', '');
    this.callCalendarDefault('calendarExtraDate', 'extraDate', 'date', '');
    this.callCalendarDefault('calendarOfficeDate', 'officeDate', 'date', '');
    this.callCalendarDefault('calendarOfficeTime', 'officeTime', 'time', 'เวลา');

    let dateFrom = new Date();
    let dateTo = new Date();
    if (this.taFormTS01171.get('auditDateEnd').value && this.taFormTS01171.get('auditDateStart').value) {
      const dF = this.taFormTS01171.get('auditDateStart').value.split('/');
      const dT = this.taFormTS01171.get('auditDateEnd').value.split('/');
      dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
    }
    $("#auditDateStart").calendar({
      type: "date",
      endCalendar: $('#auditDateEnd'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.taFormTS01171.get('auditDateStart').patchValue(text);
      }
    });
    $("#auditDateEnd").calendar({
      type: "date",
      startCalendar: $('#auditDateStart'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.taFormTS01171.get('auditDateEnd').patchValue(text);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.taFormTS01171.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  setTaFormTS01171() {
    this.taFormTS01171 = this.fb.group({
      formTsNumber: ["", Validators.required],
      bookNumber1: ["", Validators.required],
      bookNumber2: ["", Validators.required],
      docTopic: ["", Validators.required],
      docDate: ["", Validators.required],
      docDear: ["", Validators.required],
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
      bookType: ["", Validators.required],
      refBookNumber1: ["", Validators.required],
      refBookNumber2: ["", Validators.required],
      refDocDate: ["", Validators.required],
      auditDateStart: ["", Validators.required],
      auditDateEnd: ["", Validators.required],
      factDesc: ["", Validators.required],
      lawDesc: ["", Validators.required],
      factoryName2: ["", Validators.required],
      taxAmt: ["", Validators.required],
      fineAmt: ["", Validators.required],
      extraAmt: ["", Validators.required],
      exciseTaxAmt: ["", Validators.required],
      moiAmt: ["", Validators.required],
      sumAllTaxAmt: ["", Validators.required],
      extraDate: ["", Validators.required],
      officeDest: ["", Validators.required],
      officeDate: ["", Validators.required],
      officeTime: ["", Validators.required],
      signOfficerFullName: ["", Validators.required],
      signOfficerPosition: ["", Validators.required],
      officeName: ["", Validators.required],
      offficePhone: ["", Validators.required],
      headOfficerFullName: ["", Validators.required]
    })
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
          this.taFormTS01171.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              this.amphurListFilter = this.amphurList.filter(({ provinceId }) => {
                return provinceId == result.provinceId;
              });
              // reset amphur and tambol when province new select
              this.taFormTS01171.get('facAmphurName').reset();
              this.taFormTS01171.get('facTambolName').reset();

              this.callSearch(this.amphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
              break;
            // amphur search TODO filter district
            case FAC_AMPHUR_SEARCH:
              this.districtListFilter = [];
              this.districtListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
                return provinceId == result.provinceId && amphurId == result.amphurId;
              });
              // reset tambol when amphur new select
              this.taFormTS01171.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  // ===================== Action ====================
  taxAmtChange() {
    var taxAmt = this.setNumber(this.taFormTS01171.get('taxAmt').value);
    var fineAmt = this.setNumber(this.taFormTS01171.get('fineAmt').value);
    var extraAmt = this.setNumber(this.taFormTS01171.get('extraAmt').value);
    var moiAmt = this.setNumber(this.taFormTS01171.get('moiAmt').value);
    this.taFormTS01171.get('exciseTaxAmt').patchValue(taxAmt + fineAmt + extraAmt);
    this.taFormTS01171.get('sumAllTaxAmt').patchValue(taxAmt + fineAmt + extraAmt + moiAmt);
  }

  setNumber(obj): number {
    if (obj === null || obj === undefined || obj === "") {
      return 0;
    } else {
      return obj;
    }
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.taFormTS01171.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก");
  }

  export = e => {
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.taFormTS01171.get('formTsNumber').value);

        this.loading = false;
        this.submit = true;

        //export
        var form = document.createElement("form");
        form.method = "POST";
        // form.target = "_blank";
        form.action = URL.EXPORT;

        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.taFormTS01171.value);
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  clear(e) {
    this.taFormTS01171.reset();
    this.resetRadio();
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.taFormTS01171.get('newRegId').value)
    let newRegId = this.taFormTS01171.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doGet(`ta/report/form-ts-number/${this.pathTs}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }
          if (res.data.length != 0) {
            this.taFormTS01171.get('formTsNumber').patchValue(res.data[0]);
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

  resetRadio() {
    setTimeout(() => {
      $('input[name="factoryType"]').prop('checked', false);
      $('input[name="bookType"]').prop('checked', false);
    }, 100);
  }

  // ================ call back-end =================
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts01171/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let json = JSON.parse(res.data)
        this.taFormTS01171.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docTopic: json.docTopic,
          docDate: json.docDate,
          docDear: json.docDear,
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
          bookType: json.bookType,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: json.refDocDate,
          auditDateStart: json.auditDateStart,
          auditDateEnd: json.auditDateEnd,
          factDesc: json.factDesc,
          lawDesc: json.lawDesc,
          factoryName2: json.factoryName2,
          taxAmt: json.taxAmt,
          fineAmt: json.fineAmt,
          extraAmt: json.extraAmt,
          exciseTaxAmt: json.exciseTaxAmt,
          moiAmt: json.moiAmt,
          sumAllTaxAmt: json.sumAllTaxAmt,
          extraDate: json.extraDate,
          officeDest: json.officeDest,
          officeDate: json.officeDate,
          officeTime: json.officeTime,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          officeName: json.officeName,
          offficePhone: json.offficePhone,
          headOfficerFullName: json.headOfficerFullName
        })
        $('#factoryType').prop('checked', false);
        $(`#factoryType${json.factoryType}`).prop('checked', true);
        $('#bookType').prop('checked', false);
        $(`#bookType${json.bookType}`).prop('checked', true);
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
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taFormTS01171.patchValue({
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
        console.log("formTS01171 : ", this.taFormTS01171.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.taFormTS01171.value).toString() }).subscribe((res: ResponseData<any>) => {
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