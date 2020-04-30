import { Component, OnInit } from '@angular/core';
import { Int1501Service } from './int1501.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { File } from 'models/file.model';
declare let $: any;

@Component({
  selector: 'app-int1501',
  templateUrl: './int1501.component.html',
  styleUrls: ['./int1501.component.css'],
  providers: [Int1501Service]
})

export class Int1501Component implements OnInit {
  typeData: any
  dataSave: FormGroup
  submitted: boolean = false
  $form: any
  file: File[];


  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "การประเมินความเสี่ยง", route: "#" },
    { label: "เพิ่มข้อมูลปัจจัยเสี่ยง", route: "#" },
  ];
  constructor(
    private selfService: Int1501Service,
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
  ) {
    this.dataSave = this.formBuilder.group({
      typeData: ["", Validators.required],
      disburseMoney: ["", Validators.required],
      monthly: ["", Validators.required],
    })
  }

  ngOnInit() {
    this.getGroupCode()
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown().css("width", "100%")
  }

  getGroupCode() {
    this.selfService.getGroupCode().then((data) => {
      console.log("TCL: Int1501Component -> getGroupCode -> data", data)
      this.typeData = data
    })
  }

  invalidControl(control: string) {
    return this.dataSave.get(control).invalid && (this.dataSave.get(control).touched || this.submitted)
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
        this.file = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
      this.onUpload(event)
    }
  }
  
  onUpload = (event?: any) => {
    if ($('#file').val() == "") {
      this.selfService.errModalServie("กรุณาเลือกไฟล์ที่จะอัพโหลด")
      return
    } else {
      event.preventDefault();
      const form = $("#upload-form")[0];
      let formBody = new FormData(form);
      this.selfService.onUploadService(formBody)
    }
  }

  onSubmit(){
    if(this.dataSave.invalid){
      this.submitted = true
      return
    }
    this.submitted = false
  }
}

