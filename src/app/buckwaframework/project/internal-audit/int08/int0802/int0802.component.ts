import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { promise } from 'protractor';

declare var $: any;
@Component({
  selector: 'app-int0802',
  templateUrl: './int0802.component.html',
  styleUrls: ['./int0802.component.css']
})
export class Int0802Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบบัญชี", route: "#" },
    { label: "ตรวจสอบงบทดลองกระทบยอด เดบิต เครดิต บัญชีแยกประเภท", route: "#" },
  ];

  fileExel: File[];
  dataTrialBalanceSheet: Data[] = [];
  dataLedgerSheet: Data[] = [];
  dataSheet: Data[] = [];

  // dataTable
  datatable: any;

  // processList
  processList: Number;

  constructor(
    private ajax: AjaxService,

  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initDatatable();
  }

  onUpload = (event: any) => {
    this.dataTrialBalanceSheet = [];
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);
    let url = "ia/int073/readFileExcelTrialBalanceSheet";

    this.ajax.upload(
      url,
      formBody,
      res => {
        console.log("UPLOAD1 SUCCESS");
        res.json().forEach(element => {
          this.dataTrialBalanceSheet.push(element);
        });
      }
    );
  };

  onUpload2 = (event) => {
    this.dataLedgerSheet = [];
    const form2 = $("#upload-form2")[0];
    console.log($("#upload-form2"));
    let formBody2 = new FormData(form2);
    let url2 = "ia/int073/readFileExcelLedgerSheet";

    this.ajax.upload(
      url2,
      formBody2,
      res => {
        console.log("UPLOAD2 SUCCESS");
        res.json().forEach(element => {
          this.dataLedgerSheet.push(element);
        });
      }
    );
  }

  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.fileExel = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // dataTable upload
  initDatatable(): void {

    if (this.datatable != null || this.datatable != undefined) {
      this.datatable.destroy();
    }

    this.datatable = $("#dataTable3").DataTableTh({
      lengthChange: true,
      searching: false,
      loading: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.dataSheet,
      columns: [
        { data: "accountNumber" },
        { data: "accountName" },
        { data: "summitTest", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "debitTest", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "creditTest", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "liftUpTest", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "debitType", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "creditType", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "liftUpType", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "difference", render: $.fn.dataTable.render.number(",", ".", 2, "") }
      ],
      columnDefs: [
        { targets: [1], className: "left aligned" },
        { targets: [0], className: "center aligned" },
        { targets: [2, 3, 4, 5, 6, 7, 8, 9], className: "right aligned" },
      ],

      createdRow: function (row, data, dataIndex) {

        if (data.checkData == 'Y') {
          for (let i = 0; i <= 9; i++) {
            $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
          }
        } else if (data.checkData == 'T') {
          for (let i = 0; i <= 9; i++) {
            $(row).find('td:eq(' + i + ')').addClass('bg-m-blue');
          }
        }
      },
      rowCallback: (row, data, index) => {

      }

    });
  }

  clearData() {
    this.dataTrialBalanceSheet = [];
    this.dataLedgerSheet = [];
  }

  checkData() {
    this.dataSheet = [];
    let data = {
      "dataTrialBalanceSheet": this.dataTrialBalanceSheet,
      "dataLedgerSheet": this.dataLedgerSheet
    }

    const URL = "ia/int073/checkData";
    this.ajax.post(URL, data, res => {
      console.log(res.json());

      res.json().forEach(element => {
        this.dataSheet.push(element);
      });
      this.initDatatable();
    }
    );
  }

  export() {
    const URL_DOWNLOAD = "ia/int073/export";
    this.ajax.download(URL_DOWNLOAD);
  }

}

class File {
  [x: string]: any;
  name: string;
  type: string;
  value: any;
}

class Data {
  id: any = 0;
  accountNumber: any = '';
  accountName: any = '';
  summitTest: any = '';
  debitTest: any = '';
  creditTest: any = '';
  liftUpTest: any = '';

  debitType: any = '';
  creditType: any = '';
  liftUpType: any = '';
  difference: any = '';
  checkData: any = '';
}


