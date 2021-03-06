import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { IaService } from 'services/ia.service';
declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-anlysis/list-analysis-taxAmts-service-data",
}
@Component({
  selector: 'app-s05',
  templateUrl: './s05.component.html',
  styleUrls: ['./s05.component.css']
})
export class S05Component implements OnInit {
  formVo: FormVo;
  table:any;

  constructor(
    private router: Router,
    private detailService: IaService
    ) { }

  ngOnInit() {
    this.formVo = {
      startDate: '',
      endDate: ''
    }

    this.setDataService();
  }
  ngAfterViewInit(): void {
    this.dataTable();
    // setTimeout(() => {
    //   this.dataTable();
    // }, 200);
  }

  setDataService() {
    let model = this.detailService.getData();
    if (model == null) {
      this.router.navigate(['/tax-audit-new/select07/se01/s01']);
      return false;
    }
    this.formVo = model
    console.log("model service : ", this.formVo);
  }


  dataTable() {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "startDate": this.formVo.startDate,
            "endDate": this.formVo.endDate
          }));
        }
      },
      columns: [
        {
          data: "goodsDesc", className: "text-left"
        }, {
          data: "netTaxByValue", className: "text-right"
        }, {
          data: "netTaxByQty", className: "text-right"
        }, {
          data: "netTaxByValueAndQty", className: "text-right"
        }, {
          data: "anaNetTaxByValue", className: "text-right"
        }, {
          data: "anaNetTaxByQty", className: "text-right"
        }, {
          data: "anaNetTaxByValueAndQty", className: "text-right"
        }, {
          data: "diffNetTaxByValue", className: "text-right"
        }, {
          data: "diffNetTaxByQty", className: "text-right"
        }, {
          data: "diffNetTaxByValueAndQty", className: "text-right"
        }
      ],
    });

  }
}

interface FormVo {
  startDate: string;
  endDate: string;
}
