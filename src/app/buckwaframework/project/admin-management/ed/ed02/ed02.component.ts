import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatter, TextDateTH } from "helpers/datepicker";
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { AuthService } from 'services/auth.service';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
declare var $: any;

@Component({
  selector: 'app-ed02',
  templateUrl: './ed02.component.html',
  styleUrls: ['./ed02.component.css']
})
export class Ed02Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตั้งค่าตำแหน่งและอัตราเบิกจ่าย", route: "#" }
  ];
  searchPosition: FormGroup;
  datatable: any;
  datas: any = [];
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.searchPosition = this.formBuilder.group({
      position: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.onSearch()
  }

  onSearch() {
    const URL = "ed/ed02/searchPosition"
    this.ajax.doPost(URL, this.searchPosition.value).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data
      console.log(" this.datas :", this.datas);

      this.initDatatable();

    })
  }

  initDatatable(): void {
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.datas,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: "edPositionName",
          className: "left aglined",
          render: function (data, type, row, mata) {
            return new DecimalFormatPipe().transform(data, "###,###.00")
          }
        },
        {
          data: "allowancesDay",
          className: "right aglined",
          render: function (data, type, row, mata) {
            return new DecimalFormatPipe().transform(data, "###,###.00")
          }
        },
        {
          data: "allowancesHalfDay",
          className: "right aglined",
          render: function (data, type, row, mata) {
            return new DecimalFormatPipe().transform(data, "###,###.00")
          }
        },
        {
          data: "accomFeeSingle",
          className: "right aglined",
          render: function (data, type, row, mata) {
            return new DecimalFormatPipe().transform(data, "###,###.00")
          }
        },
        {
          data: "accomFeeDouble",
          className: "right aglined",
          render: function (data, type, row, mata) {
            return new DecimalFormatPipe().transform(data, "###,###.00")
          }
        },
        {
          data: "accomFeePackages",
          className: "right aglined",
          render: function (data, type, row, mata) {
            return new DecimalFormatPipe().transform(data, "###,###.00")
          }
        },
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            let btn = ''
            btn += `<button type="button" class="ui mini orange button edit-button"><i class="edit icon"></i>แก้ไข</button>`
            btn += `<button type="button" class="ui mini red button delete-button"><i class="trash icon"></i>ลบ</button>`
            return btn
          }
        }
      ]
    });
    this.datatable.on("click", "td > button.edit-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data()
      console.log("dataintable :", data);
      this.editData('/management/ed/ed02/01', data.edPersonSeq);
    })

    this.datatable.on("click", "td > button.delete-button", (event) => {
      var id = this.datatable.row($(event.currentTarget).closest("tr")).data().edPersonSeq
      this.deletePosition(id)
    })
  }

  deletePosition(deleteId: any) {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed02/delete"
        this.ajax.doPost(URL, {
          "edPersonSeq": deleteId
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.onSearch();
            this.datatable.clear().draw()
            this.datatable.rows.add(this.datas).draw()
            this.datatable.columns.adjust().draw();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "คุณต้องการลบข้อมูลใช่หรือไม่ ?");
  }

  editData(parth: string, dataId: number) {
    this.router.navigate([parth], {
      queryParams: {
        editId: dataId
      }
    })
  }


  routeTo(parth: string) {
    this.router.navigate([parth])
  }
}
