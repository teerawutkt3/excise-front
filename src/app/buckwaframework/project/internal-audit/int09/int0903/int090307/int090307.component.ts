import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-int090307',
  templateUrl: './int090307.component.html',
  styleUrls: ['./int090307.component.css']
})
export class Int090307Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ทะเบียนคุมการรับจ่ายเงิน", route: "#" },
    { label: "ทะเบียนคุม KTB-Corporate", route: "#" }
  ];
  sectorList: any[] = [];
  areaList: any[] = [];
  branchList: any[] = [];

  constructor() { }

  ngOnInit() {
  }
  search() { }
  clear() { }
  export() { }
  branch(event) { }
  area(event) { }
}
