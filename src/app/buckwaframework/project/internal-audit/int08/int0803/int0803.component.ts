import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
declare var $: any;
@Component({
  selector: 'app-int0803',
  templateUrl: './int0803.component.html',
  styleUrls: ['./int0803.component.css']
})
export class Int0803Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบบัญชี", route: "#" },
    { label: "กำหนดปัจจัยเสียงและเงื่อนไขความเสี่ยง", route: "#" },
  ];
  constructor() { }

  ngOnInit() {
    $('.tabular.menu .item').tab();
  }

}
