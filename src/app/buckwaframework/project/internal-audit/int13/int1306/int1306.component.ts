import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-int1306',
  templateUrl: './int1306.component.html',
  styleUrls: ['./int1306.component.css']
})
export class Int1306Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบแบบประเมินระบบควบคุมภายใน", route: "#" },
    { label: "สรุปผลการตรวจสอบ", route: "#" }
  ];
  constructor() { }

  ngOnInit() {
  }

}
