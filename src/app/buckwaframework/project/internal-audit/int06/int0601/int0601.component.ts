import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Store } from '@ngrx/store';
import * as INT0601ACTION from './int0601.action'
import { FormSearch } from './int0601.model';
import { Tab1 } from './int060101/int060101.model';
import { Tab2 } from './int060102/int060102.model';
import { Tab3 } from './int060103/int060103.model';
import { Utils } from 'helpers/utils';

declare var $: any;

const URL = {
  SEVE: "ia/int06/01/save-hdr",
  EXPORT:"ia/int06/01/export"
}

@Component({
  selector: 'app-int0601',
  templateUrl: './int0601.component.html',
  styleUrls: ['./int0601.component.css']
})
export class Int0601Component implements OnInit {
  loading: boolean = false;
  formSearch: FormGroup;
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  headerList: any[] = [];
  dataSave: any;
  dataStore: any;


  checkSearchFlag: boolean = false;
  flagAuditIncNo: boolean = false;


  dataTab1: Tab1;
  dataTab2: Tab2;
  dataTab3: Tab3;

  auditIncSeq: any = '';
  auditIncNo1:any='';
  officeReceive1:any='';
  receiptDateFrom1:any='';
  receiptDateTo1:any=''

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.createFormSearch();
    this.getSector();
    this.findAllDataHeader();
    this.dataSave = {
      iaAuditIncH: {
        auditIncSeq: '',
        officeCode: '',
        receiptDateFrom: '',
        receiptDateTo: '',
        auditIncNo: '',
        d1AuditFlag: '',
        d1ConditionText: '',
        d1CriteriaText: '',
        d2ConditionText: '',
        d2CriteriaText: '',
        d3ConditionText: '',
        d3CriteriaText: '',
        d4ConditionText: '',
        d4CriteriaText: '',
      },
      iaAuditIncD1List: [],
      iaAuditIncD2List: [],
      iaAuditIncD3List: []
    }

    this.dataTab1 = {
      d1AuditFlag: '',
      d1ConditionText: '',
      d1CriteriaText: '',
      d4ConditionText: '',
      d4CriteriaText: '',
      iaAuditIncD1List: []
    }

    this.dataTab2 = {
      d2ConditionText: '',
      d2CriteriaText: '',
      iaAuditIncD2List: []
    }

    this.dataTab3 = {
      d3ConditionText: '',
      d3CriteriaText: '',
      iaAuditIncD3List: []
    }

  }

  ngOnInit() {
    this.store.dispatch(new INT0601ACTION.RemoveDataSearch());
    this.store.dispatch(new INT0601ACTION.RemoveTab1());
    this.store.dispatch(new INT0601ACTION.RemoveTab2());
    this.store.dispatch(new INT0601ACTION.RemoveTab3());
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown();
    $(".ui.dropdown.ai").dropdown().css("width", "100%")
    this.calendar();
  }

  //======================================== Form ================================================
  createFormSearch() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      officeReceive: [''],
      receiptDateFrom: ['', Validators.required],
      receiptDateFromD: [''],
      receiptDateTo: ['', Validators.required],
      receiptDateToD: [''],
      auditIncNo: [''],
      flag: ['']
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
        console.log('text : ', text)
        console.log('date : ', date)
        this.formSearch.get('receiptDateFrom').patchValue(text);
        this.formSearch.get('receiptDateFromD').patchValue(date);
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        console.log('text : ', text)
        console.log('date : ', date)
        this.formSearch.get('receiptDateTo').patchValue(text);
        this.formSearch.get('receiptDateToD').patchValue(date);
      }
    });
  }
  //======================================== getSector , getArea , getBranch , findAllDataHeader ================================================
  getSector() {
    this.ajax.doPost("preferences/department/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getSector no Data !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getArea no Data !!");
      }
    })
  }

  getBranch(officeCode) {
    this.ajax.doPost("preferences/department/branch-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.branch = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getBranch no Data !!");
      }
    })
  }

  findAllDataHeader() {
    this.ajax.doPost("ia/int06/01/find-all-data-header", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.headerList = res.data;
      } else {
        console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
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
    //set to all area
    this.flagAuditIncNo = false;
    $("#area").val("0");
    this.formSearch.patchValue({ area: '0' });
    // $("#area").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);


  }

  onChangeArea(e) {
    //set to all area
    $("#branch").val("0");
    this.formSearch.patchValue({ branch: '0' });

    //$("#branch").dropdown('restore defaults');
    this.branch = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getBranch(e.target.value);

  }

  onChangeAuditIncNo(e) {
    console.log("auditIncNo :", e.target.value);

    if (Utils.isNotNull(this.formSearch.get('auditIncNo').value)) {
      this.loading = true;

      //add data form DB to store
      if (this.headerList.length > 0) {
        var data = this.headerList[e.target.value];
        this.dataTab1.d1AuditFlag = data.d1AuditFlag;
        this.dataTab1.d1ConditionText = data.d1ConditionText;
        this.dataTab1.d1CriteriaText = data.d1CriteriaText;
        this.dataTab1.d4ConditionText = data.d4ConditionText;
        this.dataTab1.d4CriteriaText = data.d4CriteriaText;
        this.dataTab2.d2ConditionText = data.d2ConditionText;
        this.dataTab2.d2CriteriaText = data.d2CriteriaText;
        this.dataTab3.d3ConditionText = data.d3ConditionText;
        this.dataTab3.d3CriteriaText = data.d3CriteriaText;
      }

      this.formSearch.patchValue({
        sector: '',
        area: '',
        branch: '',
        officeReceive: '',
        receiptDateFrom: '',
        receiptDateFromD: '',
        receiptDateTo: '',
        receiptDateToD: '',
        auditIncNo: data.auditIncNo,
        flag: 'I'
      });

      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      $("#inputDate1").val('');
      $("#inputDate2").val('');

      //add Data to store
      this.store.dispatch(new INT0601ACTION.AddTab1(this.dataTab1));
      this.store.dispatch(new INT0601ACTION.AddTab2(this.dataTab2));
      this.store.dispatch(new INT0601ACTION.AddTab3(this.dataTab3));
      this.store.dispatch(new INT0601ACTION.AddDataSearch(this.formSearch.value));
      this.router.navigate(["/int06/01/01"]);
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }

    this.checkSearchFlag = false;
  }

  serach() {
    this.auditIncSeq='';
    this.auditIncNo1='';
    this.flagAuditIncNo = false;
    this.checkSearchFlag = true;
    if (this.formSearch.valid) {
      console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
      //check for  add officeReceive
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
           
      //add flag  and  add form to store
      this.formSearch.patchValue({
        flag: 'Y',
        auditIncNo: ''
      });
      setTimeout(() => {
        $("#auditIncNo").dropdown('restore defaults');
      }, 50);
      this.store.dispatch(new INT0601ACTION.RemoveTab1());
      this.store.dispatch(new INT0601ACTION.RemoveTab2());
      this.store.dispatch(new INT0601ACTION.RemoveTab3());
      this.store.dispatch(new INT0601ACTION.AddDataSearch(this.formSearch.value));
      console.log("formSearch:", this.formSearch.value);
      this.router.navigate(["/int06/01/01"]);
    } else {
      console.log("ฟอร์มกรอกไม่ครบ :", this.formSearch.valid);
    }


  }

  clear() {
    this.flagAuditIncNo = false;
    this.checkSearchFlag = false;
    this.loading = true;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    $("#auditIncNo").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.formSearch.reset();

    setTimeout(() => {
      this.loading = false;
      this.store.dispatch(new INT0601ACTION.RemoveDataSearch());
      this.store.dispatch(new INT0601ACTION.RemoveTab1());
      this.store.dispatch(new INT0601ACTION.RemoveTab2());
      this.store.dispatch(new INT0601ACTION.RemoveTab3());
      console.log("clear Data:");
      this.router.navigate(["/int06/01"]);
    }, 1000);

  }

  save() {
    this.flagAuditIncNo = false;
    console.log('auditIncSeq', this.auditIncSeq);
    
    if(Utils.isNull(this.formSearch.get('auditIncNo').value)){
      this.checkSearchFlag = true;
    }else{
      this.checkSearchFlag = false;
    }
    if (this.formSearch.valid ||Utils.isNotNull(this.formSearch.get('auditIncNo').value)) {
      this.loading = true;
      this.messageBar.comfirm(res => {
        if (res) {
          //get data store for save
          this.dataStore = this.store.select(state => state.int0601).subscribe(datas => {
            console.log("data store:", datas);
            //set obj
            this.dataSave.iaAuditIncH.officeCode = datas.formSearch.officeReceive,
              this.dataSave.iaAuditIncH.auditIncSeq = this.auditIncSeq,
              this.dataSave.iaAuditIncH.receiptDateFrom = this.formSearch.get('receiptDateFromD').value,
              this.dataSave.iaAuditIncH.receiptDateTo = this.formSearch.get('receiptDateToD').value,
              this.dataSave.iaAuditIncH.auditIncNo = datas.formSearch.auditIncNo,
              this.dataSave.iaAuditIncH.d1AuditFlag = datas.tab1.d1AuditFlag,
              this.dataSave.iaAuditIncH.d1ConditionText = datas.tab1.d1ConditionText,
              this.dataSave.iaAuditIncH.d1CriteriaText = datas.tab1.d1CriteriaText,
              this.dataSave.iaAuditIncH.d2ConditionText = datas.tab2.d2ConditionText,
              this.dataSave.iaAuditIncH.d2CriteriaText = datas.tab2.d2CriteriaText,
              this.dataSave.iaAuditIncH.d3ConditionText = datas.tab3.d3ConditionText,
              this.dataSave.iaAuditIncH.d3CriteriaText = datas.tab3.d3CriteriaText,
              this.dataSave.iaAuditIncH.d4ConditionText = '',
              this.dataSave.iaAuditIncH.d4CriteriaText = '',
              // set list
              this.dataSave.iaAuditIncD1List = datas.tab1.iaAuditIncD1List,
              this.dataSave.iaAuditIncD2List = datas.tab2.iaAuditIncD2List,
              this.dataSave.iaAuditIncD3List = datas.tab3.iaAuditIncD3List

          });


          //call back-end Save
          this.ajax.doPost(URL.SEVE, this.dataSave).subscribe((res: any) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              console.log("res Seve: ", res.data);
              this.auditIncSeq = res.data.auditIncSeq
              this.auditIncNo1=res.data.auditIncNo;

              this.dataStore.unsubscribe();
              //call findAllDataHeader  'auditIncNo'
              setTimeout(() => {
                this.findAllDataHeader();
                this.loading = false;
              }, 1000);
              this.messageBar.successModal(res.message);
            } else {
              this.messageBar.errorModal(res.message);
              console.log("res Seve:", res.message);
            }
          });
        }
      }, MessageService.MSG_CONFIRM.SAVE)

    } else {
      this.messageBar.errorModal('กรุณาทำการค้นหาข้อมูล! หรือ เลือกเลขที่กระดาษทำการ <br>ก่อนทำการบันทึก');
      console.log("ยังไม่ได้ทำการค้นหาข้อมูล :", this.formSearch.valid);
    }
    this.loading = false;

  }


  export() {
    this.checkSearchFlag = false;
    console.log('export Data 4 tab');
    if (Utils.isNull(this.formSearch.get('auditIncNo').value)) {
      this.flagAuditIncNo = true;
      this.messageBar.errorModal('กรุณาเลือก! เลขที่กระดาษทำการ<br>ก่อนทำการพิมพ์เอกสาร');
    } else {
      this.flagAuditIncNo = false;
      var auditIncNo = this.formSearch.get('auditIncNo').value.replace("/", "_");
      this.ajax.download(`${URL.EXPORT}/${auditIncNo}`);
    }

  }

  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }

}
interface AppState {
  int0601: {
    formSearch: FormSearch,
    tab1: Tab1,
    tab2: Tab2,
    tab3: Tab3
  }
}
