import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AjaxService, AuthService } from '../../../../common/services';
import { MessageBarService } from 'app/buckwaframework/common/services';
import { BreadCrumb } from '../../../../common/models';

declare var $: any;


@Component({
  selector: 'app-int0804',
  templateUrl: './int0804.component.html',
  styleUrls: ['./int0804.component.css']
})
export class Int0804Component implements OnInit {
  breadcrumb: BreadCrumb[];
  fileExel: File[];
  // del: any;
  // dataEdit: Data;
  //Data Upload
  dataList: Data[] = [];

  dataCheckList: Data[] = [];
  // dataTable
  datatable: any;
  datatableCheck: any;


  view1: any;
  view2: any;

  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private ajax: AjaxService,
    private message: MessageBarService,
    private messageBarService: MessageBarService,
    private route: ActivatedRoute) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบบัญชี", route: "#" },
      { label: "ตรวจสอบการนำส่งเงินบัญชีเจ้าหนี้ อปท.", route: "#" }
    ];
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-07600');
    //this.dataEdit = new Data();
    $("#boxCheck").show();
    $("#boxEdit").hide();
    //this.export();
    
  }

  ngAfterViewInit() {
    this.initDatatableCheck();
  }

  onUpload = (event: any) => {
    this.loading = true;


    event.preventDefault();
    this.dataList = [];
    console.log("อัพโหลด Excel");
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);

    let url = "ia/int076/readFileExcel";
    this.ajax.upload(
      url,
      formBody,
      res => {
        // console.log(res.json());
        res.json().forEach(element => {
          this.dataList.push(element);
        });
        this.checkData();
        this.initDatatable();

        setTimeout(() => {
          this.loading = false;
        }, 1000);


      }
    )
  };

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

    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      loading: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.dataList,
      columns: [
        { data: "datePosted" },
        { data: "docNumber" },
        { data: "docType" },
        { data: "docRefer" },
        { data: "actor" },
        { data: "determination" },
        { data: "payUnit" },
        { data: "debit", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "credit", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "liftUp", render: $.fn.dataTable.render.number(",", ".", 2, "") }
        // {
        //   data: "id",
        //   render: function () {
        //     return '<button type="button" class="ui mini button primary edit"><i class="edit icon"></i> แก้ไข </button>'
        //       + '<button type="button" class="ui mini button del"><i class="trash alternate icon"></i> ลบ</button>';
        //   }
        // }
      ],
      columnDefs: [
        { targets: [0, 1, 2, 3, 5, 6], className: "center aligned" },
        { targets: [4], className: "left aligned" },
        { targets: [7, 8, 9], className: "right aligned" },
      ],

      createdRow: function (row, data, dataIndex) {

      },
      rowCallback: (row, data, index) => {

        // $("td > .edit", row).bind("click", () => {
        //   console.log(data);
        //   console.log(row);
        //   console.log(index);
        //   this.dataEdit = data;

        //   $('#editData').modal('show');
        // });

        // $("td > .del", row).bind("click", () => {
        //   console.log(data);
        //   console.log(row);
        //   console.log(index);
        //   this.del = index;
        //   $('#delData').modal('show');
        // });

      }

    });
  }

  initDatatableCheck(): void {

    if (this.datatableCheck != null || this.datatableCheck != undefined) {
      this.datatableCheck.destroy();
    }
    this.datatableCheck = $("#datatableCheck").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      pageLength: 100,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.dataCheckList,
      columns: [
        { data: "datePosted" },
        { data: "docNumber" },
        { data: "docType" },
        { data: "docRefer" },
        { data: "actor" },
        { data: "determination" },
        { data: "payUnit" },
        { data: "debit", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "credit", render: $.fn.dataTable.render.number(",", ".", 2, "") },
        { data: "liftUp", render: $.fn.dataTable.render.number(",", ".", 2, "") },
      ],
      columnDefs: [
        { targets: [0, 1, 2, 3, 5, 6], className: "center aligned" },
        { targets: [4], className: "left aligned" },
        { targets: [7, 8, 9], className: "right aligned" },
      ],

      createdRow: function (row, data, dataIndex) {
        // console.log("row");
        // console.log("data", data.color);
        // console.log("dataIndex", dataIndex);

        if (data.color == '1') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-01');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-01');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-01');
            }
          }
        } else if (data.color == '2') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-02');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-02');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-02');
            }
          }
        } else if (data.color == '3') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-03');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-03');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-03');
            }
          }
        } else if (data.color == '4') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-04');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-04');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-04');
            }
          }
        } else if (data.color == '5') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-05');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-05');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-05');
            }
          }
        } else if (data.color == '6') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-06');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-06');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-06');
            }
          }
        } else if (data.color == '7') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-07');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-07');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-07');
            }
          }
        } else if (data.color == '8') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-08');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-08');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-08');
            }
          }
        } else if (data.color == '9') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-09');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-09');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-09');
            }
          }
        } else if (data.color == '10') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-10');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-10');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-10');
            }
          }
        } else if (data.color == '11') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-11');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-11');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-11');
            }
          }
        } else if (data.color == '12') {
          if (data.credit === null || data.credit === undefined || data.credit === "") {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-red');
            }
          } else if (data.checkData == 'N') {
            $(row).find('td:eq(8)').addClass('bg-m-red');
            $(row).find('td:eq(9)').addClass('bg-m-12');
            for (let i = 0; i <= 7; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-12');
            }
          } else {
            for (let i = 0; i <= 9; i++) {
              $(row).find('td:eq(' + i + ')').addClass('bg-m-12');
            }
          }
        }



      },
      rowCallback: (row, data, index) => {

      }

    });
  }



  // editData() {
  //   this.loading = true;
  //   this.dataList.forEach(element => {
  //     if (this.dataEdit.id === element.id) {
  //       element = this.dataEdit;
  //       this.initDatatable();
  //     }
  //   });

  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 200);
  // }

  // delData() {
  //   this.loading = true;
  //   console.log("ตำแหน่ง" + this.del);
  //   this.dataList.splice(this.del, 1);
  //   this.initDatatable();

  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 200);
  // }

  backPage() {
    event.preventDefault();
    $("#boxUpload,#boxEdit").show();
    $("#boxCheck").hide();

    this.dataList = [];
    this.initDatatable();
    console.log("กลับหน้าอัปโหลด");
  }

  checkData() {
    this.loading = true;

    this.dataCheckList = [];
    event.preventDefault();

    $("#boxUpload").show();
    $("#boxCheck").show();


    console.log("ตรวจสอบข้อมูล");

    const URL = "ia/int076/checkData";
    this.ajax.post(URL, this.dataList, res => {
      console.log(res.json());
      res.json().forEach(element => {
        this.dataCheckList.push(element);
      });
      this.initDatatableCheck();

    }
    );

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }



  clearData() {
    this.dataList = [];
    this.initDatatable();

  }


  export() {
    const URL_DOWNLOAD = "ia/int076/export";
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
  datePosted: any = '';
  docNumber: any = '';
  docType: any = '';
  docRefer: any = '';
  actor: any = '';
  determination: any = '';
  payUnit: any = '';
  debit: any = '';
  credit: any = '';
  liftUp: any = '';
  color: any = '';
  checkData: any = '';
}



