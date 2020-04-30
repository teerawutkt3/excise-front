import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

import { AjaxService } from 'services/ajax.service';
import { AuthService } from 'services/auth.service';
import { Utils } from 'helpers/utils';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Int090304Service } from './int090304.service';

declare var $: any;

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId"
};
@Component({
  selector: 'app-int090304',
  templateUrl: './int090304.component.html',
  styleUrls: ['./int090304.component.css'],
  providers: [Int090304Service]
})
export class Int090304Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ทะเบียนคุมการรับจ่ายเงิน", route: "#" },
    { label: "ทะเบียนคุม KTB-Corporate", route: "#" }
  ];
  // form: FormSearch = new FormSearch();
  startDate: any = "";
  endDate: any = "";
  sectorList: any[] = [];
  areaList: any;
  branchList: any;
  budgetTypeList: any;

  constructor(
    private ajax: AjaxService,
    private int066Service: Int090304Service,
    private authService: AuthService
  ) { }

  ngAfterViewInit() {
    this.calenda();
    this.dataTable();
    this.budgetType();
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-06600');
    $(".ui.dropdown").dropdown();
    this.sector();
  }

  sector = () => {
    this.int066Service.sector().then((res) => {
      this.sectorList = res;
    });
  }
  area = (e) => {
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    this.areaList = null;
    this.branchList = null
    if (Utils.isNotNull(e.target.value)) {
      this.int066Service.area(e.target.value).then((res) => {
        this.areaList = res;;
      });
    }
  }
  branch = (e) => {
    this.branchList = null
    $("#branch").dropdown('restore defaults');
    if (Utils.isNotNull(e.target.value)) {
      this.int066Service.branch(e.target.value).then((res) => {
        this.branchList = res;
      });
    }
  }

  budgetType = () => {
    this.int066Service.budgetType().then((res)=>{
      this.budgetTypeList = res;
    });
  }
  search = () => {
    this.int066Service.search();
  }
  clear = () => {    
    this.int066Service.clear();
  }

  exportFile=()=>{
    this.int066Service.exportFile();
  }

  dataTable = () => {
    this.int066Service.dataTable();
  }
  calenda = () => {
    $("#dateF").calendar({
      maxDate: new Date(),
      endCalendar: $("#dateT"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#dateT").calendar({
      maxDate: new Date(),
      startCalendar: $("#dateF"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
  }
  export =()=>{
    let data = this.int066Service.getDataExcel();
    let formExcel = $("#form-data-excel").get(0);                      
    formExcel.action = AjaxService.CONTEXT_PATH + "ia/int066/export";
    formExcel.dataJson.value = JSON.stringify({int065ExcelList : data});		
    formExcel.submit();
  };

}
