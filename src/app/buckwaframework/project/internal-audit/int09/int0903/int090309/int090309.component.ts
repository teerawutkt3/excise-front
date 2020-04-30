import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-int090309',
  templateUrl: './int090309.component.html',
  styleUrls: ['./int090309.component.css']
})
export class Int090309Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ทะเบียนคุมฎีกาเบิกจ่ายเงิน", route: "#" }
  ];
  areaList: any[] = [];
  branchList: any[] = [];
  sectorList: any[] = [];
  constructor() { }

  ngOnInit() {
  }

  area(event) { }
  branch(event) { }
  search() { }
  clear() { }
  export() { }


}
