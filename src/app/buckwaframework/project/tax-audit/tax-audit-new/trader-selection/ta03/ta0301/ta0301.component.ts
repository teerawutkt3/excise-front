import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, PathTsSelect, ProvinceList, AmphurList, DistrictList, DataCusTa } from './ta0301.model';
import * as TA0301ACTION from "./ta0301.action";
import { Ta0301Service } from './ts0301.service';
import { Utils } from 'helpers/utils';
declare var $: any;
@Component({
  selector: 'app-ta0301',
  templateUrl: './ta0301.component.html',
  styleUrls: ['./ta0301.component.css']
})
export class Ta0301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แบบฟอร์มการตรวจสอบภาษีสรรพสามิต ตามพระราชบัญญัติภาษีสรรพสามิต พ.ศ. 2560', route: '#' },
  ];

  typeDocs: String[];
  topics: String[][];
  topic: String[];

  selectDoc: String;

  selectedDoc: String;

  sent: boolean;
  docType: any[];
  path: string;
  docTypeDisable: boolean = true;
  formTsNumberList: string[] = [];
  ta0301: Ta0301
  pathTsSelect: PathTsSelect;
  listFormTsNumber: ListFormTsNumber
  dataStore: any;
  formGroup: FormGroup;
  p: string = '';
  p2: string = '';

  provinceList: ProvinceList[];
  amphurList: AmphurList[];
  districtList: DistrictList[];

  docTypeList: string[] = [];
  constructor(
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private ta0301Service: Ta0301Service
  ) {
    // Mock Data
    this.typeDocs = ["บันทึกข้อความ", "แบบ ตส."];
    this.topics = [
      [
        "ขออนุมัติเดินทางไปปฏิบัติราชการ",
        "รายงานผลการตรวจติดตามแนะกำกับดูแล"

      ],

      []
    ];
    this.topic = [];
    this.sent = false; // false'
    this.listFormTsNumber = { listFormTsNumber: [] }
    this.createForm();
  }
  //  ========================= Initial setting ===================
  ngOnInit() {
    this.getDocType();

    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();
  }
  ngAfterViewInit(): void {
    this.callDropdown();

    this.dataStore = this.store.select(state => state).subscribe(datas => {
      console.log("main store =>", datas)
      this.formTsNumberList = datas.Ta0301.listFormTsNumber.listFormTsNumber;
      let docType = datas.Ta0301.pathTsSelectReducer.docType;
      let topic = datas.Ta0301.pathTsSelectReducer.topic;
      // ===== set Default docType ========
      if (Utils.isNull(docType)) {
        docType = "1";
      }
      console.log("Onint formTsNumberList ==>", this.formTsNumberList)
      this.formGroup.patchValue({
        docType: docType,
        topic: topic
      })
      this.p = datas.Ta0301.ta0301.pathTs;
      this.radioClick(docType);
      setTimeout(() => {
        $("#formTsNumber").dropdown('set selected', datas.Ta0301.ta0301.formTsNumber);
      }, 50);

    });
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      docType: ['1'],
      topic: ['']
    })
  }
  callDropdown() {
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      $(".ui.dropdown.ai").css("width", "100%");
    }, 50);
  }
  // =========================== Action ==========================

  radioClick(value) {
    console.log('radioClick ==> ', value);
    // ==> reset value
    this.formGroup.patchValue({
      formTsNumber: ''
    })
    $("#formTsNumber").dropdown('restore defaults');

    if (this.formGroup.get('docType').value == '2') {
      this.getListDocType()
    }
  }

  searchFormTSNumber() {

    // console.log("Ts number : ", this.formGroup.get('formTsNumber').value)
    this.ta0301 = {
      formTsNumber: this.formGroup.get('formTsNumber').value,
      pathTs: this.p
    }
    console.log('searchFormTSNumber ta0301', this.ta0301)
    console.log('searchFormTSNumber this.p', this.p)
    this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));

  }
  onSelectDoc = event => {
    this.topic = this.topics[event.target.value];
    this.selectDoc = this.typeDocs[event.target.value];
  };

  onSelectTopic(e) {
    this.formGroup.patchValue({
      formTsNumber: ''
    });
    $("#formTsNumber").dropdown('restore defaults');
    this.path = this.ta0301Service.getPathTs(e);
    console.log('onSelectTopic event', e)
    console.log('onSelectTopic path', this.path)
    this.p = this.path;
    if (this.p == "ta-form-ts0114/1") {
      this.p = 'ta-form-ts01141'
    } else if (this.p == "ta-form-ts0114/2") {
      this.p = 'ta-form-ts01142'
    }
    console.log('p==>', this.p)
    this.ta0301 = {
      formTsNumber: this.formGroup.get('formTsNumber').value,
      pathTs: this.p
    }

    this.pathTsSelect = {
      docType: this.formGroup.get('docType').value,
      topic: this.formGroup.get('topic').value
    }

    console.log('ta0301 ==> ', this.ta0301)
    console.log('pathTsSelect ==> ', this.pathTsSelect)
    this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
    this.store.dispatch(new TA0301ACTION.AddPathTsSelect(this.pathTsSelect));

    this.router.navigate(["/tax-audit-new/ta03/01/" + this.path]);
    // show form generate pdf
    this.sent = true;
    this.p2 = this.path;
    if (this.p2 == "ta-form-ts0114/1") {
      this.p2 = 'ta-form-ts01141'
    } else if (this.p2 == "ta-form-ts0114/2") {
      this.p2 = 'ta-form-ts01142'
    }
    console.log("pathTS getFormTsNumber:", this.p2);
    this.getFormTsNumber(this.p2).subscribe(res => {
      this.listFormTsNumber = {
        listFormTsNumber: res
      }
      console.log("subscribe getFormTsNumber : ", res);
      this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
    });
  };

  // onSubmit = e => {
  //   e.preventDefault();
  //   this.router.navigate(["/tax-audit-new/ta03/01/" + this.path]);
  //   // show form generate pdf
  //   this.sent = true;
  // };  
  getFormTsNumber(pathTS: string): Observable<any> {


    return new Observable(obs => {
      this.ajax.doGet(`ta/report/form-ts-number/${pathTS}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res.data);
        } else {
          this.msg.errorModal(res.message);
          obs.error(res.status);
          console.log("Error !! getFormTsNumber ");
        }
      })
    })
  }

  onDiscard = event => {
    // hide form generate pdf
    this.sent = event;
    setTimeout(() => {
      this.docTypeDisable = true;
      $('input[name="docType"]').prop('checked', false);
      $('#topic').dropdown('restore defaults');
      this.callDropdown();
      this.router.navigate(["/tax-audit-new/ta03/01/"]);
    }, 100);
  };

  docTypeClick(number: string) {
    this.selectedDoc = number;
    if ('2' == number) {
      this.docTypeDisable = false;
      this.topic = this.topics[1];
    } else {
      this.docTypeDisable = true;
      this.topic = this.topics[0];
    }
    this.callDropdown();
  }

  // ============== call back-end ================

  getDocType() {
    const URL = "ta/tax-audit/get-doc-type";
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.docType = res.data;
        if (0 < this.docType.length) {
          this.topics[1] = [];
          this.docType.forEach(element => {
            this.topics[1].push(element.value);
          });
        }
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }
  getListDocType() {
    this.ajax.doGet("ta/tax-audit/get-doc-type").subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {

        this.docTypeList = res.data;
        setTimeout(() => {
          $("#topic").dropdown('set selected', this.formGroup.get('topic').value);
        }, 200);
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getProvinceList() {
    const URL = "preferences/geography/provice-list";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.provinceList = [];
        this.provinceList = res.data;
        this.store.dispatch(new TA0301ACTION.AddProvinceList(this.provinceList));
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getAmphurList() {
    const URL = "preferences/geography/amphur-list";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.amphurList = [];
        this.amphurList = res.data;
        this.store.dispatch(new TA0301ACTION.AddAmphurList(this.amphurList));
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getDistrictList() {
    const URL = "preferences/geography/district-list";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.districtList = [];
        this.districtList = res.data;
        this.store.dispatch(new TA0301ACTION.AddDistrictList(this.districtList));
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

}

class AppState {
  Ta0301: {
    ta0301: Ta0301,
    listFormTsNumber: ListFormTsNumber,
    pathTsSelectReducer: PathTsSelect,
    proviceList: ProvinceList[],
    amphurList: AmphurList[],
    districtList: DistrictList[],
    dataCusTa: DataCusTa
  }
}