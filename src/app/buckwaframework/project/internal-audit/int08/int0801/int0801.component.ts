import { Component, OnInit } from "@angular/core";
import { Int0801Service } from "./int0801.service";
import { AuthService } from "services/auth.service";
import { BreadCrumb } from 'models/index';
import { DecimalFormat } from "helpers/decimalformat";
import { async } from 'q';

declare var $: any;
@Component({
  selector: "int0801",
  templateUrl: "./int0801.component.html",
  styleUrls: ["./int0801.component.css"],
  providers: [Int0801Service]
})
export class Int0801Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบบัญชี", route: "#" },
    { label: "ตรวจสอบข้อมูลบัญชี", route: "#" }
  ]

  loading: boolean = false;
  loadingTable: boolean = false;
  checkSave: boolean = false;
  testData: void;
  footer: any;

  constructor(private selfService: Int0801Service, private authService: AuthService) {
    this.footer = {
      ledgerAccountNumber: "",
      ledgerAccountName: "",
      bringForward: 0.0,
      debit: "",
      credit: "",
      carryForward: 0.0,
      loadingTable: ""
    };
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-08100');
    this.selfService.initDatatable();
  }

  // onSave = () => {
  //   this.loadingTable = true;
  //   this.selfService.saveData(this.getLoading, this.getStatusSave);
  // };

  changeUpload = (e: any) => {
    e.preventDefault;
    this.loading = true;
    this.selfService.onChangeUpload(e, this.getLoading);
  };

  uplodFile = (e: any) => {
    this.footer = {
      ledgerAccountNumber: "",
      ledgerAccountName: "",
      bringForward: 0.0,
      debit: "",
      credit: "",
      carryForward: 0.0,
      loadingTable: ""
    };
    e.preventDefault;
    // this.loading = true;
    this.loadingTable = true;

    this.selfService.onUpload(e, this.getLoading);
    setTimeout(async () => {
      await this.selfService.saveData(this.getLoading, this.getStatusSave);
      await this.selfService.initDatatable();
      await this.selfService
        .onInitDataTable()
        .then(val => {
          if (val) {
            this.footer = val;
            this.loadingTable = false;
          }
        });
    }, 500)
  };

  onExport = () => {
    console.log("this.testData: ", this.testData);
  };

  DF(what) {
    const df = new DecimalFormat("###,###.00");
    return df.format(what);
  }

  // onCheck() {
  //   this.selfService.onCheck();
  //   // [routerLink]="[ '/int07/2']
  // }

  reset() {
    this.selfService.clearDataTable();
  }

  getLoading = args => {
    this.loading = args;
    this.loadingTable = args;
  };

  getStatusSave = flg => {
    this.checkSave = flg;
  };

}
