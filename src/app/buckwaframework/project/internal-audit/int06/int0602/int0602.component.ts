import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormSearch } from './int0602.model';
declare var $: any;

@Component({
  selector: 'app-int0602',
  templateUrl: './int0602.component.html',
  styleUrls: ['./int0602.component.css']
})
export class Int0602Component implements OnInit {
  loading: boolean = false;
  formSearch: FormGroup;
  openForm: String;
  sectors: any[] = [];
  areas: any[] = [];
  headerList: any[] = [];
  dataSave: any;
  checkSearchFlag: boolean = false;
  formDataT1: FormGroup;
  iaAuditLicD1List: FormArray = new FormArray([]);
  iaAuditLicD2List: FormArray = new FormArray([]);
  iaAuditLicH: any;
  initHeader: any;
  action: String;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private router: Router
  ) {
    this.createFormSearch();

    this.dataSave = {
      auditLicH: {
        auditLicSeq: '',
        officeCode: '',
        licDateFromStr: '',
        licDateToStr: '',
        auditLicNo: '',
        d1AuditFlag: '',
        d1ConditionText: '',
        d1CriteriaText: '',
        d2AuditFlag: '',
        d2ConditionText: '',
        d2CriteriaText: '',
        d3ConditionText: '',
        d3CriteriaText: '',
        d4ConditionText: '',
        d4CriteriaText: '',
      },
      auditLicD1List: [],
      auditLicD2List: [],

    }
  }

  ngOnInit() {
    this.openForm = 'LIC-NO';
    this.createFormData();
    this.findDataHeader();
    this.action = "";
  }

  findDataHeader() {
    this.headerList = [];
    this.ajax.doPost("ia/int06/02/find-all-head", this.formSearch.value).subscribe((res: ResponseData<any>) => {
      //console.log(res.data);
      if (res.data.length > 0) {
        res.data.forEach(element => {
          //console.log(element);
          this.headerList.push(element);
        });
      }
    });
  }

  async loadNewHeader() {
    this.headerList = [];
    this.ajax.doPost("ia/int06/02/find-all-head", this.formSearch.value).subscribe((res: ResponseData<any>) => {
      //console.log(res.data);
      if (res.data.length > 0) {
        res.data.forEach(element => {
          this.headerList.push(element);
        });
        this.initHeader = this.headerList[0];
        this.setinitDataHeadderById(this.initHeader);

      }
    });
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown().css("width", "100%");
    this.calendar();
    this.getSector();

  }
  createFormData() {
    this.formDataT1 = this.fb.group({
      d1AuditFlag: [''],
      d1ConditionText: [''],
      d1CriteriaText: [''],
      d2AuditFlag: [''],
      d2ConditionText: [''],
      d2CriteriaText: [''],
      iaAuditLicD1List: this.fb.array([]),
      iaAuditLicD2List: this.fb.array([])
    })
    this.iaAuditLicD1List = this.formDataT1.get('iaAuditLicD1List') as FormArray;
    this.iaAuditLicD2List = this.formDataT1.get('iaAuditLicD2List') as FormArray;
  }



  //======================================== Form ================================================
  createFormSearch() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      officeCode: [''],
      licDateFrom: ['', Validators.required],
      licDateTo: ['', Validators.required],
      auditLicNo: [''],
      flag: [''],
      d1AuditFlag: [''],
      d1ConditionText: [''],
      d1CriteriaText: [''],
      d2ConditionText: [''],
      d2AuditFlag: [''],
      d2CriteriaText: ['']

    })
  }

  //======================================== calendar ================================================
  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('licDateFrom').patchValue(text);
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('licDateTo').patchValue(text);
      }
    });
  }
  //======================================== getSector , getArea , getBranch , findAllDataHeader ================================================
  getSector() {
    this.ajax.doPost("preferences/department/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        //console.log("getSector no Data !!");
      }
    })
  }

  changeTab(tabName) {
    this.openForm = tabName;
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //console.log("getArea no Data !!");
      }
    })
  }

  findAllDataHeader() {
    this.ajax.doPost("ia/int06/01/find-all-data-header", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.headerList = res.data;
        //console.log("findAllDataHeader", this.headerList.length);
      } else {
        //console.log("getauditLicNo findAllDataHeader Error !!");
      }
    });
  }
  //======================================== Action ================================================
  urlActivate(urlMatch: string) {
    return this.router.url && this.router.url.substring(0) == urlMatch;
  }

  routeTo(route: string) {
    let queryParams = {
    };
    this.router.navigate([route], {
      queryParams
    });
  }


  onChangeSector(e) {
    $("#area").val("0");
    this.formSearch.patchValue({ area: '0' });
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }


  onChangeauditLicNo(e) {
    if (e.target.value != -1) {
      this.loading = true;
      console.log("auditLicNo index :", e.target.value);
      this.initHeader = this.headerList[e.target.value];
      $("#date1").calendar('set date', new Date(this.initHeader.licDateFromStr));
      $("#date2").calendar('set date', new Date(this.initHeader.licDateToStr));

      this.formDataT1.get('d1AuditFlag').patchValue(this.initHeader.d1AuditFlag);
      this.formDataT1.get('d1ConditionText').patchValue(this.initHeader.d1ConditionText);
      this.formDataT1.get('d1CriteriaText').patchValue(this.initHeader.d1CriteriaText);
      this.formDataT1.get('d2AuditFlag').patchValue(this.initHeader.d2AuditFlag);
      this.formDataT1.get('d2ConditionText').patchValue(this.initHeader.d2ConditionText);
      this.formDataT1.get('d2CriteriaText').patchValue(this.initHeader.d2CriteriaText);
      this.setinitDataHeadderById(this.initHeader);
      this.loading = false;
    }
  }

  async setinitDataHeadderById(val) {
    //console.log("setinitDataHeadderById", val);
    this.formSearch.get('officeCode').patchValue(val.officeCode);
    let sectorValue = val.officeCode.substr(0, 2) + '0000';
    this.formSearch.get('sector').patchValue(sectorValue);
    for (let index = 0; index < this.sectors.length; index++) {
      if (sectorValue == this.sectors[index].officeCode) {
        $("#sector").dropdown('set selected', sectorValue);
        $("#area").val("0");
        this.formSearch.patchValue({ area: '0' });
        this.areas = [];
        if ("0" != sectorValue && "" != sectorValue)
          this.getArea(sectorValue);
      }
    }
    let areaValue = val.officeCode.substr(0, 4) + '00';
    this.formSearch.get('area').patchValue(areaValue);
    for (let index = 0; index < this.areas.length; index++) {
      if (areaValue != this.areas[index].officeCode) {
        $("#area").val(index);
      }
    }


    this.formSearch.controls['area'].setValue(areaValue);
    this.formSearch.controls['sector'].setValue(sectorValue);
    this.findTab1ByAuditLicNo(val.auditLicNo);
    this.findTab2ByAuditLicNo(val.auditLicNo);

  }

  findTab1ByAuditLicNo(auditLicNo) {
    this.ajax.doPost("ia/int06/02/find-tab1-bylicno", auditLicNo).subscribe((res: ResponseData<any>) => {
      //console.log("findTab1ByAuditLicNo", res.data);
      this.action = "update";
      if (res.data.length > 0) {
        this.iaAuditLicD1List.controls.splice(0, this.iaAuditLicD1List.controls.length);
        this.iaAuditLicD1List.patchValue([]);
        res.data.forEach((e, index) => {
          this.iaAuditLicD1List.push(this.createItemT1());
          this.iaAuditLicD1List.at(index).get('auditLicD1Seq').patchValue(e.auditLicD1Seq);
          this.iaAuditLicD1List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
          this.iaAuditLicD1List.at(index).get('licType').patchValue(e.licType);
          this.iaAuditLicD1List.at(index).get('licNo').patchValue(e.licNo);
          this.iaAuditLicD1List.at(index).get('runCheck').patchValue(e.runCheck);
          this.iaAuditLicD1List.at(index).get('licDate').patchValue(e.licDateStr);
          this.iaAuditLicD1List.at(index).get('sendDate').patchValue(e.sendDateStr);
          this.iaAuditLicD1List.at(index).get('licName').patchValue(e.licName);
          this.iaAuditLicD1List.at(index).get('incCode').patchValue(e.incCode);
          this.iaAuditLicD1List.at(index).get('licPrice').patchValue(e.licPrice);
          this.iaAuditLicD1List.at(index).get('licFee').patchValue(e.licFee);
          this.iaAuditLicD1List.at(index).get('licInterior').patchValue(e.licInterior);
          this.iaAuditLicD1List.at(index).get('licRemark').patchValue(e.licRemark);
        });
      } else {
        this.iaAuditLicD1List.controls.splice(0, this.iaAuditLicD1List.controls.length);
      }
    });
  }

  findTab2ByAuditLicNo(auditLicNo) {
    this.ajax.doPost("ia/int06/02/find-tab2-bylicno", auditLicNo).subscribe((res: ResponseData<any>) => {
      //console.log("findTab2ByAuditLicNo", res.data);
      this.action = "update";
      if (res.data.length > 0) {
        this.iaAuditLicD2List.controls.splice(0, this.iaAuditLicD2List.controls.length);
        this.iaAuditLicD2List.patchValue([]);
        res.data.forEach((e, index) => {
          this.iaAuditLicD2List.push(this.createItemT2());
          this.iaAuditLicD2List.at(index).get('auditLicD2Seq').patchValue(e.auditLicD2Seq);
          this.iaAuditLicD2List.at(index).get('taxCode').patchValue(e.taxCode);
          this.iaAuditLicD2List.at(index).get('licName').patchValue(e.licName);
          this.iaAuditLicD2List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
          this.iaAuditLicD2List.at(index).get('licPrice').patchValue(e.licPrice);
          this.iaAuditLicD2List.at(index).get('licCount').patchValue(e.licCount);
          this.iaAuditLicD2List.at(index).get('auditCheck').patchValue(e.auditCheck);
          this.iaAuditLicD2List.at(index).get('licT2Remark').patchValue(e.licT2Remark);
        });
      } else {
        this.iaAuditLicD2List.controls.splice(0, this.iaAuditLicD2List.controls.length);
      }
    });
  }

  search() {
    this.loading = true;
    this.checkSearchFlag = true;
    if (this.formSearch.valid) {
      //console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
      //check for  add officeCode
      if (this.formSearch.get('area').value != "0") {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);
      } else {
        if (this.formSearch.get('sector').value != "") {
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);
        } else {
          this.formSearch.patchValue({ officeReceive: "" });
        }
      }
      //add flag  and  add form to store
      this.formSearch.patchValue({
        flag: 'Y',
        auditLicNo: ''
      });
      this.ajax.doPost("ia/int06/02/find-tab1", this.formSearch.value).subscribe((res: ResponseData<any>) => {
        //console.log(res.data);
        this.action = "new";
        if (res.data.length > 0) {
          this.iaAuditLicD1List.controls.splice(0, this.iaAuditLicD1List.controls.length);
          this.iaAuditLicD1List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditLicD1List.push(this.createItemT1());
            this.iaAuditLicD1List.at(index).get('auditLicD1Seq').patchValue(e.auditLicD1Seq);
            this.iaAuditLicD1List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
            this.iaAuditLicD1List.at(index).get('licType').patchValue(e.licType);
            this.iaAuditLicD1List.at(index).get('licNo').patchValue(e.licNo);
            this.iaAuditLicD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.iaAuditLicD1List.at(index).get('licDate').patchValue(e.licDate);
            this.iaAuditLicD1List.at(index).get('sendDate').patchValue(e.sendDate);
            this.iaAuditLicD1List.at(index).get('licName').patchValue(e.licName);
            this.iaAuditLicD1List.at(index).get('incCode').patchValue(e.incCode);
            this.iaAuditLicD1List.at(index).get('licPrice').patchValue(e.licPrice);
            this.iaAuditLicD1List.at(index).get('licFee').patchValue(e.licFee);
            this.iaAuditLicD1List.at(index).get('licInterior').patchValue(e.licInterior);
            this.iaAuditLicD1List.at(index).get('licRemark').patchValue(e.licRemark);
          });
        } else {
          this.iaAuditLicD1List.controls.splice(0, this.iaAuditLicD1List.controls.length);
        }
      });

      this.ajax.doPost("ia/int06/02/find-tab2", this.formSearch.value).subscribe((res: ResponseData<any>) => {
        //console.log(res.data);
        this.action = "new";
        if (res.data.length > 0) {
          this.iaAuditLicD2List.controls.splice(0, this.iaAuditLicD2List.controls.length);
          this.iaAuditLicD2List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditLicD2List.push(this.createItemT2());
            this.iaAuditLicD2List.at(index).get('auditLicD2Seq').patchValue(e.auditLicD2Seq);
            this.iaAuditLicD2List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditLicD2List.at(index).get('licName').patchValue(e.licName);
            this.iaAuditLicD2List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
            this.iaAuditLicD2List.at(index).get('licPrice').patchValue(e.licPrice);
            this.iaAuditLicD2List.at(index).get('licCount').patchValue(e.licCount);
            this.iaAuditLicD2List.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.iaAuditLicD2List.at(index).get('licT2Remark').patchValue(e.licT2Remark);
          });
        } else {
          this.iaAuditLicD2List.controls.splice(0, this.iaAuditLicD2List.controls.length);
        }
      });
    }
    this.loading = false;
  }





  createItemT1(): FormGroup {
    return this.fb.group({
      auditLicD1Seq: [''],
      licType: [''],
      auditLicNo: [''],
      licNo: [''],
      runCheck: [''],
      licDate: [''],
      sendDate: [''],
      licName: [''],
      incCode: [''],
      licPrice: [''],
      licFee: [''],
      licInterior: [''],
      licRemark: []
    });
  }
  createItemT2(): FormGroup {
    return this.fb.group({
      auditLicD2Seq: [''],
      taxCode: [''],
      licName: [''],
      auditLicNo: [''],
      licPrice: [''],
      licCount: [''],
      auditCheck: [''],
      licT2Remark: []
    });
  }

  async save() {
    //console.log("save", this.formSearch.value);
    let body = JSON.stringify(this.formSearch.value);
    console.log(body);

    if (this.initHeader == null || this.initHeader == undefined) {
      this.dataSave.auditLicH.officeCode = this.formSearch.value.officeCode;
      this.dataSave.auditLicH.licDateFromStr = this.formSearch.value.licDateFrom;
      this.dataSave.auditLicH.licDateToStr = this.formSearch.value.licDateTo;
      this.dataSave.auditLicH.d1AuditFlag = this.formDataT1.value.d1AuditFlag;
      this.dataSave.auditLicH.d1ConditionText = this.formDataT1.value.d1ConditionText;
      this.dataSave.auditLicH.d1CriteriaText = this.formDataT1.value.d1CriteriaText;
      this.dataSave.auditLicH.d2AuditFlag = this.formDataT1.value.d2AuditFlag;
      this.dataSave.auditLicH.d2ConditionText = this.formDataT1.value.d2ConditionText;
      this.dataSave.auditLicH.d2CriteriaText = this.formDataT1.value.d2CriteriaText;
    } else {
      this.dataSave.auditLicH = this.initHeader;
    }

    for (let index = 0; index < this.iaAuditLicD1List.length; index++) {
      const element = this.iaAuditLicD1List.at(index);
      //console.log(element.value);
      this.dataSave.auditLicD1List.push(element.value);
      this.dataSave.auditLicD1List[index].licDateStr = element.value.licDate;
      this.dataSave.auditLicD1List[index].sendDateStr = element.value.sendDate;

    }

    for (let index = 0; index < this.iaAuditLicD2List.length; index++) {
      const element = this.iaAuditLicD2List.at(index);
      console.log(element.value);

      this.dataSave.auditLicD2List.push(element.value);
    }
    //console.log("Send Data : " + this.dataSave);

    // this.dataSave.auditLicD1List = this.iaAuditLicD1List.value;

    this.ajax.doPost("ia/int06/02/save-lic-data", this.dataSave).subscribe(async (res: ResponseData<any>) => {
      //console.log(" this.action : ", res.data);
      if (this.action == "new") {
        await this.loadNewHeader();
        //console.log(2);


        while (this.headerList != null && this.headerList != undefined && this.headerList.length > 0) {
          setTimeout(() => {
            //console.log("Sleep", this.headerList);

            this.formSearch.get('auditLicNo').patchValue(this.initHeader.auditLicNo);
            $("#auditLicNo").val("0").change();
            this.formSearch.patchValue({ auditLicNo: '0' });
           
          }, 50);
        }
      }
    });
  }


  reEditRunCheck(i, val) {
    //console.log(val);
    for (let index = i; index < this.iaAuditLicD1List.length; index++) {
      this.iaAuditLicD1List.at(index).get('runCheck').patchValue(val);
      val++;
    }
  }

  editList(idx, licNo: any) {
    let index = idx + 1;
    this.iaAuditLicD1List.insert(index, this.createItemT1());
    this.iaAuditLicD1List.at(index).get('licNo').patchValue(licNo);
  }


  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
  clear() {
    this.checkSearchFlag = false;
    this.loading = true;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    $("#auditLicNo").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.formSearch.reset();
    this.formDataT1.reset();
    this.iaAuditLicD1List.controls.splice(0, this.iaAuditLicD1List.controls.length);
    this.iaAuditLicD2List.controls.splice(0, this.iaAuditLicD2List.controls.length);

    this.loading = false;
  }


}

interface AppState {
  int0601: {
    formSearch: FormSearch,
  }
}