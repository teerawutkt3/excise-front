import { Component, OnInit } from '@angular/core';
import { IaService } from 'services/ia.service';
import { Utils } from 'helpers/utils';
import { Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-anlysis/tax-qty-data",
}

@Component({
  selector: 'app-ta02020201',
  templateUrl: './ta02020201.component.html',
  styleUrls: ['./ta02020201.component.css']
})
export class Ta02020201Component implements OnInit {

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
      endDate: '',
      peperBaNumber: '',
      dutyGroupId: ''
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
      lengthChange: true,
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
            "endDate": this.formVo.endDate,
            "peperBaNumber" : this.formVo.peperBaNumber,
            "dutyGroupId" : this.formVo.dutyGroupId
          }));
        }
      },
      columns: [
        {
          data: "goodsDesc", className: "text-left"
        }, {
          data: "taxQty", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "monthStatementTaxQty", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffTaxQty", className: "text-right",
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
  peperBaNumber: string;
  dutyGroupId: string;
}
