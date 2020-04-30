import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;
@Component({
  selector: 'app-int0501',
  templateUrl: './int0501.component.html',
  styleUrls: ['./int0501.component.css']
})

export class Int0501Component implements OnInit {
  searchFlag: String;
  pickedTypeList: any;
  statusList: any;

  travelTo1List: any;
  travelTo2List: any;
  travelTo3List: any;

  travelTo1AddList: any;
  travelTo2AddList: any;
  travelTo3AddList: any;

  travelToDescription: any;
  breadcrumb: BreadCrumb[];

  constructor(
    private message: MessageBarService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private iaService: IaService,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ประมาณการค่าใช้จ่ายในการเดินทางไปราชการ", route: "#" }
    ];

  }
  calenda = function () {
    // endCalendar: $("#date2"),
    // startCalendar: $("#date"),
    $("#date").calendar({
      endCalendar: $("#date2"),
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: this.changeDate
    });
    $("#date2").calendar({
      startCalendar: $("#date"),
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: this.changeDate2
    });
    $("#date3").calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป")
    });
    $("#date4").calendar({
      endCalendar: $("#date5"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#date5").calendar({
      startCalendar: $("#date4"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });

    $("#modalDate1").calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป")
    });
    $("#modalDate2").calendar({
      endCalendar: $("#modalDate3"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#modalDate3").calendar({
      startCalendar: $("#modalDate2"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
  }

  clickSearch = function () {
    $("#searchFlag").val("TRUE");
    $('#tableData').DataTable().ajax.reload();
  }

  clickClear = function () {
    $("#searchFlag").val("FALSE");
    $('input[type=text]').val("");
    $('select').val("");
    $('#tableData').DataTable().ajax.reload();
  }

  dataTable = function () {
    var table = $('#tableData').DataTable({
      "lengthChange": true,
      "serverSide": false,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": '/ims-webapp/api/ia/int091/list',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": $("#searchFlag").val(),
            "dateFrom": $("#dateFrom").val(),
            "dateTo": $("#dateTo").val(),
            "createdBy": $("#createdBy").val(),
            "pickedType": $("#pickedType").val(),
            "fiscalYear": $("#fiscalYear").val(),
            "departureDate": $("#departureDate").val(),
            "returnDate": $("#returnDate").val(),
            "travelTo": $("#travelTo").val(),
            "status": $("#status").val()
          }));
        },
      },
      "columns": [
        {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "createdDate",
          "className": "ui center aligned"
        }, {
          "data": "createdBy"
        }, {
          "data": "pickedType",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var s = '';
            if (data == 1162) {
              s = 'ก่อนเดินทางไปราชการ';
            } else {
              s = 'หลังเดินทางไปราชการ';
            }
            return s;
          }
        }, {
          "data": "fiscalYear",
          "className": "ui center aligned"
        }, {
          "data": "departureDate",
          "className": "ui center aligned"
        }, {
          "data": "returnDate",
          "className": "ui center aligned"
        }, {
          "data": "travelToDescription"
        }, {
          "data": "status",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var s = '';

            if (data == 1167) {
              s = 'ดำเนินการสำเร็จ';
            } else if (data == 1862) {
              s = 'อนุมัติเดินทาง';
            } else if (data == 1863) {
              s = 'ยืมเงิน';
            } else if (data == 1864) {
              s = 'กันเงิน';
            } else if (data == 1865) {
              s = 'ชดใช้เงินยืม';
            } else {
              s = 'กำลังดำเนินการ';
            }
            return s;
          }
        }, {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="mini ui primary button btn-edit"><i class="eye icon"></i>รายละเอียด</button>';
            btn += '<button class="mini red ui button btn-delete"><i class="close icon"></i>ยกเลิกรายการ</button>';
            return btn;
          }
        }
      ]
    });

    //button edit>
    table.on('click', 'tbody tr button.btn-edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();
      this.router.navigate(['/int05/01/01'], {
        queryParams: { idProcess: data.id }
      });
      console.log(data);
    });

    table.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();

      const URL = "ia/int091/delete";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ยกเลิกรายการ");

    });

  }

  pickedTypeDropdown = () => {

    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "ACC_FEE", lovIdMaster: 1161 }, res => {
      this.pickedTypeList = res.json();
    });
  }

  statusDropdown = () => {
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "ACC_FEE", lovIdMaster: 1165 }, res => {
      this.statusList = res.json();
    });
  }
  travelTo1Dropdown = () => {

    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "SECTOR_VALUE" }, res => {
      this.travelTo1List = res.json();
    });
  }

  travelTo2Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo2List = res.json();
        this.setTravelTo(e);
      });
    }
  }

  travelTo3Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo3List = res.json();
        this.setTravelTo(e);
      });
    }
  }

  travelTo1AddDropdown = () => {
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "SECTOR_VALUE" }, res => {
      this.travelTo1AddList = res.json();
    });
  }

  travelTo2AddDropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo2AddList = res.json();
        this.setTravelToAdd(e);
      });
    }
  }

  travelTo3AddDropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo3AddList = res.json();
        this.setTravelToAdd(e);
      });
    }
  }

  add() {

    $('#modalAddHead').modal('hide');
    const URL = "ia/int091/add";
    this.ajax.post(URL, {
      createdDate: "ACC_FEE",
      createdBy: $("#createdByAdd").val(),
      pickedType: $("#pickedTypeAdd").val(),
      fiscalYear: $("#fiscalYearAdd").val(),
      departureDate: $("#departureDateAdd").val(),
      returnDate: $("#returnDateAdd").val(),
      travelTo: $("#travelToAdd").val(),
      travelToDescription: this.travelToDescription
    }, res => {
      const msg = res.json();

      if (msg.messageType == "C") {
        this.message.successModal(msg.messageTh);
      } else {
        this.message.errorModal(msg.messageTh);
      }
      $("#searchFlag").val("TRUE");
      $('#tableData').DataTable().ajax.reload();
    });
  }

  modalAddHead() {
    $('#modalAddHead').modal('show');
    this.calenda();
  }




  setTravelTo = e => {
    $('#travelTo').val(e.target.value);
    $('#travelToId').val(e.target.value);

  }

  setTravelToAdd = e => {
    $('#travelToAdd').val(e.target.value);
    $('#travelToIdAdd').val(e.target.value);

    if ($("#travelTo3Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text() + " " + $('#travelTo2Add option:selected').text() + " " + $('#travelTo3Add option:selected').text();
    } else if ($("#travelTo2Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text() + " " + $('#travelTo2Add option:selected').text();
    } else if ($("#travelTo1Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text();
    }
    console.log("TravelToDescription : ", this.travelToDescription);
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('INT-09100');
    this.dataTable();
    this.calenda();
    this.pickedTypeDropdown();
    this.statusDropdown();
    this.travelTo1Dropdown();
    this.travelTo1AddDropdown();

  }

}
