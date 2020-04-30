import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Utils } from 'helpers/utils';
import { Router } from '@angular/router';
import { IaService } from 'services/ia.service';
declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-anlysis/income-compare-last-year-data",
}

@Component({
  selector: 'app-ta02020208',
  templateUrl: './ta02020208.component.html',
  styleUrls: ['./ta02020208.component.css']
})
export class Ta02020208Component implements OnInit {

  formVo: FormVo;
  table: any;

  constructor(
    private router: Router,
    private detailService: IaService
  ) { }

  ngOnInit() {
    this.formVo = {
      newRegId: '',
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
      this.router.navigate(['/tax-audit-new/ta02/02/02']);
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
      // lengthChange: true,x
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "newRegId": this.formVo.newRegId,
            "startDate": this.formVo.startDate,
            "endDate": this.formVo.endDate
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: "taxMonth", className: "text-center"
        }, {
          data: "incomeLastYearAmt", className: "text-center",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "incomeCurrentYearAmt", className: "text-center",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeAmt", className: "text-center",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomePnt", className: "text-center",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
      ],
    });

  }
}

interface FormVo {
  newRegId: string;
  startDate: string;
  endDate: string;
}
