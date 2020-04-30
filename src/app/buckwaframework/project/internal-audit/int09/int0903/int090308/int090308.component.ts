import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-int090308',
  templateUrl: './int090308.component.html',
  styleUrls: ['./int090308.component.css']
})
export class Int090308Component implements OnInit {
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
