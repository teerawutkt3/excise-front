import { Injectable } from "@angular/core";
import { Form } from "@angular/forms";
import { AjaxService } from "services/ajax.service";
import { Utils } from "helpers/utils";
import { From } from './form.model';
import { Int0901011Service } from './int090101-1.service';

declare var $: any;

@Injectable()

export class Int0901013Service {

    table: any;
    form: From = new From();
    sectorList: any;
    araeList: any;
    constructor(
        private ajax: AjaxService

    ) { }

    sector = (sectorCb: Function) => {
        let url = "ia/int0613/sector";
        this.ajax.get(url, res => {
            sectorCb(res.json());
        });
    }

    area = (idMaster, areaCb: Function) => {
        let url = "ia/int0613/area";
        this.ajax.post(url, idMaster, res => {
            areaCb(res.json());
        });
    }

    year = (yearCb: Function) => {
        let url = "ia/int0613/year";
        this.ajax.get(url, res => {
            yearCb(res.json());
        });
    }
    search = (int0901011Service: Int0901011Service) => {
        this.form.searchFlag = "TRUE";
        this.form.dataBudget = int0901011Service.getDataBudget();
        this.form.dataLedger = int0901011Service.getDataLedger();

        console.log("Data Service : ", this.form);
        $("#dataTable").DataTable().ajax.reload();

    }
    clear = () => {
        this.form.searchFlag = "FALSE";
    }

    dataTable = () => {
        this.table = $("#dataTable").DataTableTh({
            "serverSide": true,
            "searching": false,
            "ordering": false,
            "processing": true,
            "scrollX": true,
            "fixedColumns": {
                "leftColumns": 3
            },
            "ajax": {
                "url": '/ims-webapp/api/ia/int0613/findAll',
                "contentType": "application/json",
                "type": "POST",
                "data": (d) => {
                    return JSON.stringify($.extend({}, d, {
                        "sector": $("#sector").val(),
                        "area": $("#area").val(),
                        "year": $("#year").val(),
                        "searchFlag": this.form.searchFlag,
                        "dataBudget": this.form.dataBudget,
                        "dataLedger": this.form.dataLedger,
                    }));
                },
            },
            "drawCallback": () => {
                $('.mark-tr').closest('tr').addClass('negative');
            },
            "columns": [
                {
                    "data": "accountId",
                    "render": function (data, type, row, meta) {
                        var order = meta.row + meta.settings._iDisplayStart + 1;
                        var differenceExperimentalBudget = Utils.moneyFormat(row.differenceExperimentalBudget);
                        var differenceledger = Utils.moneyFormat(row.differenceledger);
                       
                        if (differenceExperimentalBudget != "0.00" || differenceledger != "0.00" ) {                            
                            return '<span class="mark-tr">' + order + '</span>';
                        }
                        return order;
                    },
                    "className": "ui center aligned"
                }, {
                    "data": "accountId",
                    "className": "ui center aligned"
                }, {
                    "data": "accountName",
                    "className": "ui left aligned",
                }, {
                    "data": "serviceReceive",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "suppressReceive",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "budgetReceive",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "sumReceive",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "serviceWithdraw",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "suppressWithdraw",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "budgetWithdraw",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "sumWithdraw",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "experimentalBudget",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "differenceExperimentalBudget",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "ledger",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "differenceledger",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "serviceBalance",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "suppressBalance",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "budgetBalance",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "sumBalance",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "averageCost",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "averageGive",
                    "className": "ui right aligned"
                }, {
                    "data": "averageFrom",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "averageComeCost",
                    "className": "ui right aligned",
                }, {
                    "data": "moneyBudget",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "moneyOut",
                    "className": "ui right aligned",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    }
                }, {
                    "data": "note",
                    "className": "ui center aligned",
                    "render": (data, row) => {
                        var btn = '';
                        btn += '<button class="ui mini blue button btn-detail"><i class="eye icon"></i>หมายเหตุ</button>';
                        return btn;
                    }
                }
            ]
        });
        this.table.on('click', 'tbody tr button.btn-detail', (e) => {
            var closestRow = $(e.target).closest('tr');
            var data = this.table.row(closestRow).data();
            console.log(data.note);
            $("#detail").modal({
                "onShow": () => {
                    $("#des").html(data.note);
                }
            }).modal('show');
        });
    }
}