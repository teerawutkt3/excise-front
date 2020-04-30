import { Component, OnInit } from '@angular/core';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';

declare var $: any;

const URL = {
  SEVE: "ia/int06/01/save-hdr",
  EXPORT: "ia/int06/01/export",
  SEARCH_T1: "ia/int06/01/find-tab1",
  SEARCH_BY_AUDIT_NO_T1: "ia/int06/01/find-tab1-by-auditnumber"
}

@Component({
  selector: 'app-int0600',
  templateUrl: './int0600.component.html',
  styleUrls: ['./int0600.component.css']
})
export class Int0600Component implements OnInit {
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditIncNoList: any[] = [];

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagAuditIncNo: boolean = false;
  tabActivate: string = '';
  //formSearch
  formSearch: FormGroup;
  //formT1
  formT1: FormGroup;
  iaAuditIncD1List: FormArray = new FormArray([]);

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.FormSearch();
    this.getSector();
    this.getAuditIncNoList();
    this.FormTab1();
    this.ListTab1();
    this.tabActivate = '1';
  }
  ngAfterViewInit(): void {
    this.calendar();
  }
  //======================= Form =============================
  FormSearch() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      officeReceive:[''],
      receiptDateFrom: ['', Validators.required],
      receiptDateTo: ['', Validators.required],
      auditIncNo: [''],
    })
  }


  //============== DATA FROM  TAB1============================
  FormTab1() {
    this.formT1 = this.fb.group({
      d1AuditFlag: [''],
      d1ConditionText: [''],
      d1CriteriaText: [''],
      iaAuditIncD1List: this.fb.array([])
    })
    this.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List') as FormArray;
  }

  ListTab1(): FormGroup {
    return this.fb.group({
      officeCode: [''],
      docCtlNo: [''],
      receiptNo: [''],
      runCheck: [''],
      receiptDate: [''],
      taxName: [''],
      taxCode: [''],
      amount: [''],
      remark: [''],
      checkTax0307: [''],
      checkStamp: [''],
      checkTax0704: [''],
      remarkTax: [''],
    });
  }
//============== DATA FROM  TAB2============================

//============== DATA FROM  TAB3============================

//============== DATA FROM  TAB4============================


  //=======================  calendar ==================================
  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('receiptDateFrom').patchValue(text);
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('receiptDateTo').patchValue(text);
      }
    });
  }
  //=========== getSector , getArea , getBranch , getAuditIncNo =======
  getSector() {
    this.ajax.doPost("preferences/department/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        console.log("getSector no Data !!");
      }
    })
  }
  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        console.log("getArea no Data !!");
      }
    })
  }
  getBranch(officeCode) {
    this.ajax.doPost("preferences/department/branch-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.branch = res.data;
      } else {
        console.log("getBranch no Data !!");
      }
    })
  }
  getAuditIncNoList() {
    this.ajax.doPost("ia/int06/01/find-all-data-header", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditIncNoList = res.data;
      } else {
        console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
  }
  //================================= action ==============================
  onChangeSector(e) {
    this.flagAuditIncNo = false;
    $("#area").val("0");
    this.formSearch.patchValue({ area: '0' });
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }
  onChangeArea(e) {
    $("#branch").val("0");
    this.formSearch.patchValue({ branch: '0' });
    this.branch = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getBranch(e.target.value);
  }
  onChangeAuditIncNo(e) {
    console.log("auditIncNo :", e.target.value);
  }

  reEditRunCheck(i, val) {
    console.log(val);
    for (let index = i; index < this.formT1.value.iaAuditIncD1List.length; index++) {
      this.iaAuditIncD1List.at(index).get('runCheck').patchValue(val);
      val++;
    }
  }

  onInsertList(idx,receiptNo:any) {
    let index=idx+1;
    this.iaAuditIncD1List.insert(index, this.ListTab1());
    this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(receiptNo);
  }

  //================ activate =======================
  activate(tab: string) {
    return this.tabActivate == tab;
  }

  showTab(tab: string) {
    this.tabActivate = tab;
  }
  //============ serach ===========================
  serach() {
    this.flagAuditIncNo = false;
    this.checkSearchFlag = true;
    if (this.formSearch.valid) {
      console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
      if (this.formSearch.get('branch').value != "0") {
        this.formSearch.get('officeReceive').patchValue(this.formSearch.get('branch').value);
      } else {
        if (this.formSearch.get('area').value != "0") {
          this.formSearch.get('officeReceive').patchValue(this.formSearch.get('area').value);
        } else {
          if (this.formSearch.get('sector').value != "") {
            this.formSearch.get('officeReceive').patchValue(this.formSearch.get('sector').value);
          } else {
            this.formSearch.patchValue({ officeReceive: "" });
          }
        }
      }
      console.log("formSearch:", this.formSearch.value);
      //call searchCriteria
      this.searchCriteria(this.formSearch.value);
    } else {
      console.log("ฟอร์มกรอกไม่ครบ :", this.formSearch.valid);
    }
  }
  //=================================== call Back End ==================================
  searchCriteria = (formSearch: any): any => {
    this.loading = true;
    //tab1
    this.ajax.doPost(URL.SEARCH_T1, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("res.data:", res.data);
        this.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List') as FormArray;
        if (res.data.length > 0) {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD1List.push(this.ListTab1());
            this.iaAuditIncD1List.at(index).get('officeCode').patchValue(e.officeReceive);
            this.iaAuditIncD1List.at(index).get('docCtlNo').patchValue(e.incCtlNo);
            this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(e.receiptNo);
            this.iaAuditIncD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.iaAuditIncD1List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD1List.at(index).get('taxName').patchValue(e.incomeName);
            this.iaAuditIncD1List.at(index).get('taxCode').patchValue(e.incomeCode);
            this.iaAuditIncD1List.at(index).get('amount').patchValue(e.netTaxAmt);
            this.iaAuditIncD1List.at(index).get('remark').patchValue(e.remark);
          });
        } else {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formT1.patchValue({
          d1AuditFlag: '',
          d1ConditionText: '',
          d1CriteriaText: ''
        });

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchCriteria_Tab1 :", res.message);
      }
    });
    //tab2
    //tab3
    this.loading = false;
  }
  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}
