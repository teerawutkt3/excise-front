import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { TextDateTH, formatter } from "helpers/datepicker";
import { Utils } from "helpers/utils";
import { AuthService } from "services/auth.service";
import { AjaxService } from "services/ajax.service";
import { Int090303Service } from './int090303.service';
import { BreadCrumb, ResponseData } from 'models/index';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from "../../../../../common/services/message-bar.service";
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';

declare var $: any;
const URL = {
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params",
  BADJET_TYPE: "ia/int09/03/03/budgetTypeDropdown"
}

@Component({
  selector: 'app-int090303',
  templateUrl: './int090303.component.html',
  styleUrls: ['./int090303.component.css'],
  providers: [Int090303Service]
})
export class Int090303Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ทะเบียนคุมเช็ค", route: "#" }
  ];

  startDate: any = "";
  endDate: any = "";
  sectorList: any;
  offcode: any;
  pageNo: any;
  dataPerPage: any;
  budgetTypeList: any;
  dataInTable: any = [];
  dataTableV: any;
  table: any;
  datatable: any;
  idinspec: any;
  dataFilterIdParams: any = [];
  dataFillter: FormGroup
  datas: any;
  dataTableList: any[];
  budgetType:any;

  constructor(
    private int090303Service: Int090303Service,
    private authService: AuthService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private formBuilder: FormBuilder,
  ) {
    this.dataFillter = this.formBuilder.group({
      budgetType : ["" , Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      offcode: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.idinspec = this.route.snapshot.queryParams["id"];
    console.log("idinspec : ", this.idinspec);
    this.getData();
    this.budgetYearDropdown();
  }

  ngAfterViewInit() {
    this.calenda();
    this.authService.reRenderVersionProgram('INT-06500');
    $(".ui.dropdown").dropdown();
    this. initDatatable();
  }

  getData() {
    let id = this.idinspec;
    this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${id}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilterIdParams = response.data;
        this.datas = this.dataFilterIdParams[0];
        console.log(this.dataFilterIdParams.length);
        console.log("response int 10/01 : ", this.dataFilterIdParams);
      } else {
        this.messageBarService.errorModal(response.message);
      }
    }, err => {
      this.messageBarService.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  budgetYearDropdown() {
    const URL = "ia/int09/03/03/budgetTypeDropdown"
    this.ajax.doPost(URL, {}).subscribe((res: any) => {
      this.budgetTypeList = res;
      console.log("budgetTypeList : ",this.budgetTypeList);
      if (this.budgetTypeList.findIndex(obj => obj.budgetType == this.budgetType) == -1) {
        this.budgetTypeList.unshift({
          budgetType: this.budgetType,
          endDate: null,
          offcode: null,
          startDate: null
        });
      }
    });
  }

  onSubmit(e) {
    var offCodeTo = this.dataFilterIdParams[0].exciseCode;
    var budgetTypeto = $("#budgetType").val();   
    this.dataFillter.patchValue({
      offcode: offCodeTo,
      budgetType : budgetTypeto
    });
    console.log("dataFillter :",this.dataFillter.value);
    this.ajax.post("ia/int09/03/03/list", this.dataFillter.value, res => {
      this.dataTableList = res.json().data;
      console.log("dataTableList :", this.dataTableList);
      this.initDatatable();
    });
  }

  // search = () => {
  //   $("#searchFlag").val("TRUE");
  //   this.int090303Service.search();
  //   setTimeout(() => {
  //     this.dataInTable = this.int090303Service.getTable().data();
  //     console.log(this.dataInTable);
  //     console.log(this.dataInTable.length);
  //   }, 500);
  // }

  clear = () => {
    $("#searchFlag").val("FALSE");
    $(".office").dropdown('restore defaults');
    $("#dateForm").val("");
    $("#dateTo").val("");
    this.table.ajax.reload();
  }

  initDatatable(): void {
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.dataTableList,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "ui center aligned"
        },
        {
          data: "paymentDate",
          className: "ui center aligned",
          render(data){
            return new DateStringPipe().transform(data , false)
          }
        },
        {
          data: "refPayment",
          className: "ui center aligned"
        },
        {
          data: "bankName",
          className: "ui left aligned"
        },
        {
          data: "amount",
          className: "ui right aligned",
          render: (data) => {
            return Utils.moneyFormatDecimal(data);
          },
        },
        {
          data: "budgetType",
          className: "ui left aligned"
        },
        {
          data: "itemDesc",
          className: "ui left aligned"
        },
        {
          data: "payee",
          className: "ui left aligned"
        }]
    });
  }

  calenda = () => {
    $("#dateF").calendar({
      endCalendar: $("#dateT"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFillter.patchValue({
          startDate: text
        });
      }
    });

    $("#dateT").calendar({
      startCalendar: $("#dateF"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFillter.patchValue({
          endDate: text
        });
      }
    });
  }

  // export
  // export =()=>{
  //   let data = this.int090303Service.getDataExcel();
  //   let formExcel = $("#form-data-excel").get(0);                      
  //   formExcel.action = AjaxService.CONTEXT_PATH + "ia/int065/export";
  //   formExcel.dataJson.value = JSON.stringify({int065ExcelList : data});		
  //   formExcel.submit();
  // };
}


