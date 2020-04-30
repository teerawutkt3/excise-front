import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { ListFormTsNumber, Ta0301, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { Utils } from 'helpers/utils';
import { PathTs } from '../path.model';
import { Observable } from 'rxjs/internal/Observable';
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0117",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
declare var $: any;
@Component({
  selector: 'app-ta030117',
  templateUrl: './ta030117.component.html',
  styleUrls: ['./ta030117.component.css']
})
export class Ta030117Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taformTS0117: FormGroup;

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
  ) {
    this.setTaFormTS0117();
  }

  // ============= Initial setting ==================
  ngOnInit() {

    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taformTS0117.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0117)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taformTS0117.get('formTsNumber').value))
        this.getFormTs(this.taformTS0117.get('formTsNumber').value);
    });
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date','');
    this.callCalendarDefault('calendarRefDocDate', 'refDocDate', 'date','');
    this.callCalendarDefault('calendarAuditDate', 'auditDate', 'date','');
    this.callCalendarDefault('calendarCallBookDate', 'callBookDate', 'date','');
    this.callCalendarDefault('calendarTaxFormDateStart', 'taxFormDateStart', 'date','');
    this.callCalendarDefault('calendarTaxFormDateEnd', 'taxFormDateEnd', 'date','');
    this.callCalendarDefault('calendarTestimonyDate', 'testimonyDate', 'date','');
    this.callCalendarDefault('calendarExtraDate', 'extraDate', 'date','');
    this.callCalendarDefault('calendarPaymentDate', 'paymentDate', 'date','');
    this.callCalendarDefault('calendarOfficeDate', 'officeDate', 'date','');
    this.callCalendarDefault('calendarOfficeTime', 'officeTime','time', 'เวลา');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  callCalendarDefault(id: string, formControlName: string, type: string,patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.taformTS0117.get(`${formControlName}`).patchValue(text);
      }
    });
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
          this.taformTS0117.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              this.amphurListFilter = this.amphurList.filter(({ provinceId }) => {
                return provinceId == result.provinceId;
              });
              // reset amphur and tambol when province new select
              this.taformTS0117.get('facAmphurName').reset();
              this.taformTS0117.get('facTambolName').reset();

              this.callSearch(this.amphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
              break;
            // amphur search TODO filter district
            case FAC_AMPHUR_SEARCH:
              this.districtListFilter = [];
              this.districtListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
                return provinceId == result.provinceId && amphurId == result.amphurId;
              });
              // reset tambol when amphur new select
              this.taformTS0117.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  setTaFormTS0117() {
    this.taformTS0117 = this.fb.group({
      formTsNumber: ["",],
      bookNumber1: [""],
      bookNumber2: [""],
      docTopic: [""],
      docDate: [""],
      docDear: [""],
      refBookNumber1: [""],
      refBookNumber2: [""],
      refDocDate: [""],
      auditDate: [""],
      callBookNumber1: [""],
      callBookNumber2: [""],
      callBookDate: [""],
      factoryName: [""],
      newRegId: [""],
      facAddrNo: [""],
      facMooNo: [""],
      facSoiName: [""],
      facThnName: [""],
      facTambolName: [""],
      facAmphurName: [""],
      facProvinceName: [""],
      facZipCode: [""],
      officerFullName: [""],
      officerPosition: [""],
      taxFormDateStart: [""],
      taxFormDateEnd: [""],
      testimonyDate: [""],
      factDesc: [""],
      lawDesc: [""],
      factoryName2: [""],
      taxAmt: [""],
      fineAmt: [""],
      extraAmt: [""],
      exciseTaxAmt: [""],
      moiAmt: [""],
      sumAllTaxAmt: [""],
      extraDate: [""],
      paymentDest: [""],
      paymentExciseTaxAmt: [""],
      paymentDate: [""],
      officeDest: [""],
      officeDate: [""],
      officeTime: [""],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      officeName: [''],
      officePhone: [''],
      headOfficerFullName: ['']
    })
  }
  searchNewRegId() {
    console.log("searchNewRegId", this.taformTS0117.get('newRegId').value)
    let newRegId = this.taformTS0117.get('newRegId').value;
    this.getOperatorDetails(newRegId);
  }

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taformTS0117.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode
        })
        console.log("formTS0117: ", this.taformTS0117.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.taformTS0117.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.taformTS0117.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }
  clear(e) {
    this.taformTS0117.reset();
  }
  export(e) {
    this.submit = true;
    console.log("export", this.taformTS0117.value)

    var form = document.createElement("form");
    form.action = URL.EXPORT;
    form.method = "POST";
    form.style.display = "none";
    //  form.target = "_blank";

    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.taformTS0117.value).toString();
    form.appendChild(jsonInput);
    document.body.appendChild(form);
    form.submit();

  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0117/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taformTS0117.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docTopic: json.docTopic,
          docDate: json.docDate,
          docDear: json.docDear,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: json.refDocDate,
          auditDate: json.auditDate,
          callBookNumber1: json.callBookNumber1,
          callBookNumber2: json.callBookNumber2,
          callBookDate: json.callBookDate,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facMooNo: json.facMooNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          officerFullName: json.officerFullName,
          officerPosition: json.officerPosition,
          taxFormDateStart: json.taxFormDateStart,
          taxFormDateEnd: json.taxFormDateEnd,
          testimonyDate: json.testimonyDate,
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
          paymentDest: json.paymentDest,
          paymentExciseTaxAmt: json.paymentExciseTaxAmt,
          paymentDate: json.paymentDate,
          officeDest: json.officeDest,
          officeDate: json.officeDate,
          officeTime: json.officeTime,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          officeName2: json.officeName2,
          officePhone: json.officePhone,
          headOfficerFullName: json.headOfficerFullName,
        })
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

  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doGet(`ta/report/form-ts-number/${this.pathTs}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }


          if (res.data.length != 0) {

            this.taformTS0117.get('formTsNumber').patchValue(res.data[0]);
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

