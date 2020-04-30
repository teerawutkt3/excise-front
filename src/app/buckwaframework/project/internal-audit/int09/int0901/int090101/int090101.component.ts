import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'helpers/utils';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { Int0901011Service } from './int090101-1.service';
import { BreadCrumb } from 'models/index';
import { From } from './form.model';
import { Int0901013Service } from './int090101-3.service';
declare var $: any;
@Component({
  selector: 'app-int090101',
  templateUrl: './int090101.component.html',
  styleUrls: ['./int090101.component.css']
})
export class Int090101Component implements OnInit {
  form: From = new From();
  sectorList: any;
  araeList: any;
  yearList: any;
  //value init
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ตรวจสอบข้อมูลค่าใช้จ่าย", route: "#" },
    { label: "ตรวจสอบข้อมูลค่าใช้จ่าย", route: "#" }
  ];
  constructor(
    private int0901013Servicen: Int0901013Service,
    private int0901011Service: Int0901011Service,
    private router: Router,
    private authService: AuthService,
    private message: MessageBarService
  ) {
   
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-06130');
    this.callDropdown();
  }

  ngAfterViewInit() {
    this.dataTable();
    this.getSector();
    this.year();
  }

  getSector = () => {
    this.int0901013Servicen.sector(this.callBackSector);
  }

  changeSector = (e) => {
    this.araeList = null;
    if (e.target.value != null && e.target.value != "") {
      $("#arae").dropdown('restore defaults');
      let idMaster = e.target.value;
      this.int0901013Servicen.area(idMaster, this.callBackArea);
    }
  }

  year = () => {
    this.int0901013Servicen.year(this.callBackYear);
  }
  search = () => {

    if (Utils.isNull($("#sector").val())) {
      this.message.alert('กรุณาระบุ สำนักงานสรรพสามิตภาค');
      return false;
    }
    if (Utils.isNull($("#area").val())) {
      this.message.alert('กรุณาระบุ สำนักงานสรรพสามิตพื้นที่');
      return false;
    }
    if (Utils.isNull($("#year").val())) {
      this.message.alert('กรุณาระบุ ปีงบประมาณ');
      return false;
    }

    this.int0901013Servicen.search(this.int0901011Service);
  }

  clear = async () => {
    await this.int0901013Servicen.clear();
    await $(".ui.dropdown").dropdown('restore defaults');

  }

  dataTable = () => {
    this.int0901013Servicen.dataTable();
  }

  callDropdown = () => {
    $(".ui.dropdown").dropdown();
  }

  callBackSector = (result) => {
    this.sectorList = result;
  }
  callBackArea = (result) => {
    this.araeList = result;
  }
  callBackYear = (result) => {
    this.yearList = result;
  }

}

