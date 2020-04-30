import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Observable } from 'rxjs';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/pdf/ta-form-ts0110",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta030110',
  templateUrl: './ta030110.component.html',
  styleUrls: ['./ta030110.component.css']
})
export class Ta030110Component implements OnInit {

  formTS0110: FormGroup;
  taFormTS0110VoList: FormArray;

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
  ) { }

  // =============== Initial setting ==========
  ngOnInit() {
    this.setForm();
    // disable testimonyCardOtherDesc
    this.testimonyCardTypeClick('0');
    this.resetRadio();

    console.log("ngOnInit formGroup : ", this.formTS0110.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0110.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0110)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0110.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0110.get('formTsNumber').value);
      }
    });
  }

  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    $("#date").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formTS0110.get("docDate").patchValue(text);
      }

    });
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
    this.formTS0110 = this.fb.group({
      formTs0110Id: ["", Validators.required],
      testimonyOf: ["", Validators.required],
      testimonyTopic: ["", Validators.required],
      docDate: ["", Validators.required],
      officerFullName: ["", Validators.required],
      officerPosition: ["", Validators.required],
      testimonyFullName: ["", Validators.required],
      testimonyAge: ["", Validators.required],
      testimonyNationality: ["", Validators.required],
      testimonyRace: ["", Validators.required],
      testimonyAddrNo: ["", Validators.required],
      testimonyBuildNameVillage: ["", Validators.required],
      testimonyFloorNo: ["", Validators.required],
      testimonyRoomNo: ["", Validators.required],
      testimonySoiName: ["", Validators.required],
      testimonyThnName: ["", Validators.required],
      testimonyTambolName: ["", Validators.required],
      testimonyAmphurName: ["", Validators.required],
      testimonyProvinceName: ["", Validators.required],
      testimonyZipCode: ["", Validators.required],
      testimonyTelNo: ["", Validators.required],
      testimonyCardType: ["", Validators.required],
      testimonyCardOtherDesc: ["", Validators.required],
      testimonyCardNo: ["", Validators.required],
      testimonyCardSource: ["", Validators.required],
      testimonyCardCountry: ["", Validators.required],
      testimonyPosition: ["", Validators.required],
      testimonyFactoryFullName: ["", Validators.required],
      newRegId: ["", Validators.required],
      testimonyText: ["", Validators.required],
      formTsNumber: [""],
      taFormTS0110VoList: this.fb.array([]),
      testimonyPageNo: [0]
    })
  }

  callSearch(data: any[], className: string, fieldName: string, formName: string) {
    const TESTIMONY_PROVINCE_SEARCH = "testimonyProvinceSearch";
    const TESTIMONY_AMPHUR_SEARCH = "testimonyAmphurSearch";
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
          this.formTS0110.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case TESTIMONY_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              this.amphurListFilter = this.amphurList.filter(({ provinceId }) => {
                return provinceId == result.provinceId;
              });
              // reset amphur and tambol when province new select
              this.formTS0110.get('testimonyAmphurName').reset();
              this.formTS0110.get('testimonyTambolName').reset();

              this.callSearch(this.amphurListFilter, 'testimonyAmphurSearch', 'amphurName', 'testimonyAmphurName');
              break;
            // amphur search TODO filter district
            case TESTIMONY_AMPHUR_SEARCH:
              this.districtListFilter = [];
              this.districtListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
                return provinceId == result.provinceId && amphurId == result.amphurId;
              });
              // reset tambol when amphur new select
              this.formTS0110.get('testimonyTambolName').reset();

              this.callSearch(this.districtListFilter, 'testimonyTambolSearch', 'districtName', 'testimonyTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  // ================ Action ==========================
  testimonyCardTypeClick(number: string) {
    this.formTS0110.get("testimonyCardType").patchValue(number);
    if ('3' == number) {
      this.formTS0110.get('testimonyCardOtherDesc').enable();
    } else {
      this.formTS0110.get('testimonyCardOtherDesc').disable();
    }
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;

        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message)

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS0110.get('formTsNumber').value)
            this.loading = false;
          });
          this.loading = false;
        })
      }
    }, "ยืนยันการบันทึก");
  }

  clear(e) {
    this.formTS0110.reset();
    this.clearTaFormTS01101List();
    this.resetRadio();
  }

  export(e) {

    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0110.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;

        this.submit = true;
        console.log("export : ", this.formTS0110.value);
        var form = document.createElement("form");
        form.method = "POST";
        // form.target = "_blank";
        form.action = URL.EXPORT;

        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0110.value).toString();
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      });
    });

  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0110.get('newRegId').value)
    let newRegId = this.formTS0110.get('newRegId').value;
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
            this.formTS0110.get('formTsNumber').patchValue(res.data[0]);
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

  createTaFormTS01101List(): FormGroup {
    return this.fb.group({
      formTs0110Id: ["", Validators.required],
      testimonyPageNo: ["", Validators.required],
      testimonyText: ["", Validators.required],
      formTsNumber: [""]
    })
  }

  addTaFormTS01101List(): void {
    this.taFormTS0110VoList = this.formTS0110.get('taFormTS0110VoList') as FormArray;
    this.taFormTS0110VoList.push(this.createTaFormTS01101List());
    this.taFormTS0110VoList.get((this.taFormTS0110VoList.value.length - 1).toString()).get('testimonyPageNo').patchValue((this.taFormTS0110VoList.value.length).toString());
  }

  removeTaFormTS01101List(index: number): void {
    this.taFormTS0110VoList = this.formTS0110.get('taFormTS0110VoList') as FormArray;
    this.taFormTS0110VoList.removeAt(index);
  }

  clearTaFormTS01101List() {
    this.taFormTS0110VoList = this.formTS0110.get('taFormTS0110VoList') as FormArray;
    this.taFormTS0110VoList.controls.splice(0, this.taFormTS0110VoList.controls.length)
  }

  resetRadio() {
    setTimeout(() => {
      $('input[name="testimonyCardType"]').prop('checked', false);
    }, 100);
  }

  // ================ call back-end =================
  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0110.patchValue({
          testimonyFactoryFullName: res.data.facFullname
        })
        console.log("formTS0110 : ", this.formTS0110.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-from-ts/ta-form-ts0110/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let json = JSON.parse(res.data);
        console.log("taFormTS0120 json : ", json);
        this.formTS0110.patchValue({
          formTs0110Id: json.formTs0110Id,
          testimonyOf: json.testimonyOf,
          testimonyTopic: json.testimonyTopic,
          docDate: json.docDate,
          officerFullName: json.officerFullName,
          officerPosition: json.officerPosition,
          testimonyFullName: json.testimonyFullName,
          testimonyAge: json.testimonyAge,
          testimonyNationality: json.testimonyNationality,
          testimonyRace: json.testimonyRace,
          testimonyAddrNo: json.testimonyAddrNo,
          testimonyBuildNameVillage: json.testimonyBuildNameVillage,
          testimonyFloorNo: json.testimonyFloorNo,
          testimonyRoomNo: json.testimonyRoomNo,
          testimonySoiName: json.testimonySoiName,
          testimonyThnName: json.testimonyThnName,
          testimonyTambolName: json.testimonyTambolName,
          testimonyAmphurName: json.testimonyAmphurName,
          testimonyProvinceName: json.testimonyProvinceName,
          testimonyZipCode: json.testimonyZipCode,
          testimonyTelNo: json.testimonyTelNo,
          testimonyCardType: json.testimonyCardType,
          testimonyCardOtherDesc: json.testimonyCardOtherDesc,
          testimonyCardNo: json.testimonyCardNo,
          testimonyCardSource: json.testimonyCardSource,
          testimonyCardCountry: json.testimonyCardCountry,
          testimonyPosition: json.testimonyPosition,
          testimonyFactoryFullName: json.testimonyFactoryFullName,
          newRegId: json.newRegId,
          testimonyText: json.testimonyText,
          testimonyPageNo: json.testimonyPageNo,
          formTsNumber: json.formTsNumber
        })

        this.taFormTS0110VoList = this.formTS0110.get('taFormTS0110VoList') as FormArray;
        this.taFormTS0110VoList.controls = [];
        for (let index = 0; index < json.taFormTS0110VoList.length; index++) {
          const element = json.taFormTS0110VoList[index];
          this.addTaFormTS01101List();
          this.taFormTS0110VoList.get(index.toString()).patchValue({
            formTs0110Id: element.formTs0110Id,
            testimonyPageNo: element.testimonyPageNo,
            testimonyText: element.testimonyText,
            formTsNumber: element.formTsNumber
          });
        }
        // set checkbox
        setTimeout(() => {
          $('#testimonyCardType').prop('checked', false);
          $(`#testimonyCardType${json.testimonyCardType}`).prop('checked', true);
        }, 100);
        // call new search
        // find amphur for get provinceId and amphurId
        var amphur = this.amphurList.find((element) => {
          return element.amphurName == json.testimonyAmphurName;
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
          this.callSearch(this.amphurListFilter, 'testimonyAmphurSearch', 'amphurName', 'testimonyAmphurName');
          this.callSearch(this.districtListFilter, 'testimonyTambolSearch', 'districtName', 'testimonyTambolName');
        }

        console.log("taFormTS0110 : ", this.formTS0110.value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost(`ta/report/save-from-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0110.value).toString() }).subscribe((res: ResponseData<any>) => {
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
      this.callSearch(this.provinceList, 'testimonyProvinceSearch', 'provinceName', 'testimonyProvinceName');
    });
  }

  getAmphurList() {
    this.amphurStore = this.store.select(state => state.Ta0301.amphurList).subscribe(datas => {
      this.amphurList = [];
      this.amphurList = datas;
      this.callSearch(this.amphurList, 'testimonyAmphurSearch', 'amphurName', 'testimonyAmphurName');
    });
  }

  getDistrictList() {
    this.districtStore = this.store.select(state => state.Ta0301.districtList).subscribe(datas => {
      this.districtList = [];
      this.districtList = datas;
      this.callSearch(this.districtList, 'testimonyTambolSearch', 'districtName', 'testimonyTambolName');
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
