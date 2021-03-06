import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router, Data } from '@angular/router';
declare var $: any;
const URL = {
  LIST: AjaxService.CONTEXT_PATH + "ta/create-paper-service/list-rawMaterialReceiptVo",
  UPLOAD:"ta/create-paper-service/uploedFileServicePaperPricePerUnitVo"
}
@Component({
  selector: 'app-ta02020803',
  templateUrl: './ta02020803.component.html',
  styleUrls: ['./ta02020803.component.css']
})
export class Ta02020803Component implements OnInit {
  startDate:any="";
  endDate:any="";
  startDateTM:any;
  endDateTM:any;
  file: File[];
  idHead:any;
  hideResult: boolean = false;
  hideUpload: boolean = false;
  searchForm: FormGroup;
  showTable: boolean = false;
  table: any;
  formVo :FormVo;
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService, private messageBar: MessageBarService,
     private router: Router,
     
  ) { 
    this.formVo = {
      startDate: '',
      endDate: ''
    }
  }
  search = (e) => {
    if (e.startDate || e.stopDate) {
      this.hideResult = true;
      console.log("serach : ", e)
      console.log(e.startDate)
      console.log(e.endDate)
      this.formVo = e;
      console.log("formVo : ", this.formVo);
      setTimeout(() => {
        this.dataTable();
      }, 100);
    }else{
      this.hideResult = false;
    }

  }

 

  clear = (e) => {
    console.log(e)
    this.hideResult = false;
  }
  uploadTemplate = (e) => {
    console.log(e)
    this.hideUpload = true;
  
  }


  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      exciseId: [''],
      userTaxNuber: [''],
      operator: [''],
      analysisNumber: [''],
      type: [''],
      coordinates: [''],
      startDate: [''],
      endDate: ['']
    })
  }

  upload() {

  }


  dataTable = () => {
  
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      // pageLength: 3,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.LIST,
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
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "memberCode", className: "text-center"
        
        }
        , {
          data: "memberFullName", className: "text-center"
        }, {
          data: "memberStartDate", className: "text-center"
        }, {
          data: "memberEndDate", className: "text-center"
        }, {
          data: "memberCoupon", className: "text-center"
        }, {
          data: "memberUsedDate", className: "text-center"
        }, {
          data: "memberStatus", className: "text-center"
        },
    
      ],
    });


  }
  
  onUpload = (event: any) => {
    //this.loading = true;
    
    event.preventDefault();
   // this.dataList = [];
    console.log("อัพโหลด Excel");
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);

    this.ajax.upload(
      URL.UPLOAD,formBody, res => {
      console.log(res.json());
    
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
        this.file = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  exportFile=()=>{
    console.log("exportFile2");
    
    let param = "";
    let url = "ta/create-paper-service/exportFileMemberStatusServiceVo";
    
    param +="?idHead=" + this.idHead;
    param +="&startDate=" + this.startDate;
    param +="&endDate=" + this.endDate;
    param +="&billLost=" + $("#billLost").val();

    console.log("idHead : ",this.idHead);
    this.ajax.download(url+param);
    
  }


}
interface FormVo {
  startDate: string;
  endDate: string;
}
class File {
  [x: string]: any;
  name: string;
  type: string;
  value: any;
}