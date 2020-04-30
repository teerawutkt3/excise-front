import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import * as TA0601ACTION from '../int0601.action';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { AjaxService } from 'services/ajax.service';
import { RequestModel, Tab3, IaAuditIncD3List } from './int060103.model';
import { Utils } from 'helpers/utils';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';
declare var $: any;

const URL = {
  SEARCH_T3: "ia/int06/01/find-tab3",
  SEARCH_T3_DTL: "ia/int06/01/find-tab3-dtl"
}

@Component({
  selector: 'app-int060103',
  templateUrl: './int060103.component.html',
  styleUrls: ['./int060103.component.css']
})
export class Int060103Component implements OnInit {
  dataStore: any;
  // for to store
  request: RequestModel;
  response: IaAuditIncD3List[];
  dataTab3: Tab3;
  //for to view
  formGroup: FormGroup;
  iaAuditIncD3List: FormArray = new FormArray([]);

  loading: boolean = false;
  loadingModal: boolean = false;
  sumAmount: any;
  sumCountReceipt: any;

  dataTable1: any = [];
  sumAmountTable1: any;

  table1: any;

  isShowTb: boolean = true;
  sumAmount2: any;
  sumCountReceipt2: any;

  dataTable2: any = [];
  sumAmountTable2: any;

  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<any>
  ) {
    this.request = {
      officeReceive: '',
      receiptDateFrom: '',
      receiptDateTo: ''
    }
    this.dataTab3 = {
      d3ConditionText: '',
      d3CriteriaText: '',
      iaAuditIncD3List: []
    }
    this.createForm();
    this.sumAmount = '';
    this.sumCountReceipt = '';

    this.dataTable1 = [];
    this.dataTable2 = [];
  }

  ngOnInit() {
    this.dataStore = this.store.select(state => state.int0601).subscribe(datas => {
      // add value list.length from store
      let length = datas.tab3.iaAuditIncD3List.length;
      //add request
      this.request = {
        officeReceive: datas.formSearch.officeReceive,
        receiptDateFrom: datas.formSearch.receiptDateFrom,
        receiptDateTo: datas.formSearch.receiptDateTo
      }
      console.log('checkFlag', datas.formSearch);
      //check value '' from store
      if (Utils.isNotNull(datas.formSearch.flag) && length == 0 && Utils.isNull(datas.tab3.d3ConditionText) && Utils.isNull(datas.tab3.d3CriteriaText)) {
        // check  auditIncNo  
        if (Utils.isNotNull(datas.formSearch.auditIncNo)) {
          console.log("searchByAuditNo_Tab3");//searchByAuditNo_Tab2
        } else {
          this.getDataTab3(this.request);//searchCriteria
          console.log("getDataTab3");
        }
      } else {
        this.response = datas.tab3.iaAuditIncD3List;
        this.formGroup.patchValue({
          d3ConditionText: datas.tab3.d3ConditionText,
          d3CriteriaText: datas.tab3.d3CriteriaText
        })
        var sumAmount1 = 0;
        var sumCountReceipt1 = 0;
        if (this.response.length > 0) {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
          this.response.forEach((e, index) => {
            this.iaAuditIncD3List.push(this.createList());
            this.iaAuditIncD3List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD3List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD3List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD3List.at(index).get('countReceipt').patchValue(e.countReceipt);
            this.iaAuditIncD3List.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.iaAuditIncD3List.at(index).get('remark').patchValue(e.remark);

            sumAmount1 += parseInt(e.amount);
            sumCountReceipt1 += parseInt(e.countReceipt);
          });

          //resule sum sumAmount,sumCountReceipt
          this.sumAmount = sumAmount1;
          this.sumCountReceipt = sumCountReceipt1;

        } else {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
        }

      }
    });
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  //============== DATA FROM ============================

  createForm() {
    this.formGroup = this.formBuilder.group({
      d3ConditionText: [''],
      d3CriteriaText: [''],
      iaAuditIncD3List: this.formBuilder.array([])

    })
    this.iaAuditIncD3List = this.formGroup.get('iaAuditIncD3List') as FormArray;
  }

  createList(): FormGroup {
    return this.formBuilder.group({
      taxCode: [''],
      taxName: [''],
      amount: [''],
      countReceipt: [''],
      auditCheck: [''],
      remark: ['']
    });
  }
  //==================== Action ===============================
  changeAudit() {
    this.addDataStore();
  }

  onBlurTextArea() {
    this.addDataStore();
  }

  blurRemark() {
    this.addDataStore();
  }

  taxCodeDtl(taxCode: string) {
    console.log("taxCode :", taxCode);

    $("#taxCodeDtl").modal({
      onShow: () => {
        this.getTaxCodeDtlTable(taxCode);
      },

      onDeny: () => {
        // this.table1.destroy();
        this.dataTable1 = [];
        this.sumAmountTable1 = '';
      }

    }).modal('show');

  }


  showAllDtl() {
    this.isShowTb = false;
    this.getDataAll();
  }

  showMaster() {
    this.isShowTb = true;
  }

  addDataStore() {
    this.dataTab3 = {
      d3ConditionText: this.formGroup.get('d3ConditionText').value,
      d3CriteriaText: this.formGroup.get('d3CriteriaText').value,
      iaAuditIncD3List: this.iaAuditIncD3List.value
    }
    this.store.dispatch(new TA0601ACTION.AddTab3(this.dataTab3));
  }


  //========================= backend ===========================
  getDataTab3(request: RequestModel) {
    this.loading = true;
    this.ajax.doPost(URL.SEARCH_T3, request).subscribe((res: ResponseData<IaAuditIncD3List[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        var sumAmount1 = 0;
        var sumCountReceipt1 = 0;
        console.log("res data_Tab3", res);
        if (res.data.length > 0) {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD3List.push(this.createList());
            this.iaAuditIncD3List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD3List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD3List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD3List.at(index).get('countReceipt').patchValue(e.countReceipt);
            this.iaAuditIncD3List.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.iaAuditIncD3List.at(index).get('remark').patchValue(e.remark);
            sumAmount1 += parseInt(e.amount);
            sumCountReceipt1 += parseInt(e.countReceipt);
          });
          //resule sum sumAmount,sumCountReceipt
          this.sumAmount = sumAmount1;
          this.sumCountReceipt = sumCountReceipt1;

        } else {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
        }

      } else {
        this.messageBar.errorModal("error getDataTab3 find-tab3")
      }

      this.addDataStore();
      this.loading = false;
    });
  }

  getTaxCodeDtlTable(taxCode: string) {
    this.loadingModal = true;
    this.dataTable1 = [];
    this.sumAmountTable1 = '';
    const request = {
      taxCode: taxCode,
      receiptDateFrom: this.request.receiptDateFrom,
      receiptDateTo: this.request.receiptDateTo,
      officeReceive: this.request.officeReceive
    }

    this.ajax.doPost(URL.SEARCH_T3_DTL, request).subscribe((res: any) => {
      console.log("res:",res);
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("res.data.wsIncfri8020Inc",res.data.wsIncfri8020Inc);
        if (res.data.wsIncfri8020Inc.length > 0) {
          this.dataTable1 = res.data.wsIncfri8020Inc;
          this.sumAmountTable1 = res.data.sumAmt;
          // setTimeout(() => {
          //   this.tablePlan();
          // }, 1000);
        } else {
          this.dataTable1 = [];
          this.sumAmountTable1 = '';
        }
        setTimeout(() => {
          this.loadingModal = false;
        }, 500);
      } else {
        this.messageBar.errorModal("error getTaxCodeDtlTable")
      }
    });

  }

  getDataAll() {
    this.loading = true;
    this.dataTable2 = [];
    this.sumAmountTable2 = '';
    this.ajax.doPost(URL.SEARCH_T3_DTL, this.request).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data.wsIncfri8020Inc.length > 0) {
          this.dataTable2 = res.data.wsIncfri8020Inc;
          this.sumAmountTable2 = res.data.sumAmt;
        } else {
          this.dataTable2 = [];
          this.sumAmountTable2 = '';
        }

      } else {
        this.messageBar.errorModal("error getDataAll")
      }
      this.loading = false;
    });
  }

  //============================ table =========================
  tablePlan = () => {
    this.table1 = $("#tableDetail1").DataTableTh({
      processing: true,
      serverSide: false,
      lengthChange: false,
      paging: false,
      searching: false,
      scrollX: true,
      data: this.dataTable1,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "receiptDate",
          className: "center",
          render(data) {
            return new DateStringPipe().transform(data, false)
          }
        }, {
          data: "incomeName", className: "text-left"
        }, {
          data: "incomeCode", className: "text-center"
        },
        {
          data: "netTaxAmt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
      ],
    });


  }

}  
