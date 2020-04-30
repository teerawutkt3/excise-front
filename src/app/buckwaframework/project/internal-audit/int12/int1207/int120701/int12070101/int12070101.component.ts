import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Observable } from 'rxjs/internal/Observable';
import { ComboBox } from 'models/combobox.model';
import { Int12070101Service } from './int12070101.service';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
// import moment = require('moment');
// import * as moment from "moment";
import { Utils } from 'helpers/utils';

declare var $: any;
@Component({
  selector: 'app-int12070101',
  templateUrl: './int12070101.component.html',
  styleUrls: ['./int12070101.component.css'],
  providers: [Int12070101Service]
})
export class Int12070101Component implements OnInit {

  rentHouseForm: FormGroup;
  breadcrumb: BreadCrumb[];
  submitted: boolean = false;
  titles: Observable<ComboBox>;
  auth: any;
  loadingUL: boolean = false;
  tableUpload: any = [];
  flgOnLoad: boolean = true;
  monthStart: any;

  receiptsRH: FormArray = new FormArray([]);

  constructor(
    private selfService: Int12070101Service,
    private authService: AuthService,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private route: ActivatedRoute
  ) {
    this.setVariable();
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "คำขอเบิก", route: "#" },
      { label: "ข้อมูลคำขอเบิก", route: "#" },
      { label: "บันทึกคำขอเบิกเงินค่าเช่าบ้าน (แบบ 6006)", route: "#" }
    ];
  }

  ngOnInit() {
    this.calendar();
    this.authService.reRenderVersionProgram("INT-06111").then(obj => {
      this.rentHouseForm.patchValue({
        name: obj.fullName,
        position: obj.title,
        affiliation: "-"
      });
    });
    // this.titles = this.selfService.dropdown("TITLE", null);
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown ai").css("width", "100%");
  }

  setVariable() {
    this.rentHouseForm = this.fb.group({
      name: ["", Validators.required],
      position: ["", Validators.required],
      affiliation: ["", Validators.required],
      paymentCost: ["", Validators.required],
      paymentFor: ["", Validators.required],
      period: ["", Validators.required],
      refReceipts: ["", Validators.required],
      billAmount: ["", Validators.required],
      salary: ["", Validators.required],
      // requestNo: ["", Validators.required],
      notOver: ["", Validators.required],
      periodWithdraw: ["", Validators.required],
      periodWithdrawTo: ["", Validators.required],
      totalMonth: ["", Validators.required],
      totalWithdraw: ["", Validators.required],
      receipts: [0, Validators.required],
      receiptsRH: this.fb.array([])
    });
  }

  calendar = function () {
    $("#periodCld").calendar({
      // minDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: formatter("monthOnly"),
      onChange: (date, ddmmyyyy) => {
        this.rentHouseForm.patchValue({ period: ddmmyyyy });
      }
    });

    $("#periodWithdrawCldform").calendar({
      // minDate: new Date(),
      endCalendar: $("#periodWithdrawCldto"),
      type: "month",
      text: TextDateTH,
      formatter: formatter("monthOnly"),
      onChange: (date, ddmmyyyy) => {
        this.monthStart = date;
        this.rentHouseForm.patchValue({
          periodWithdraw: ddmmyyyy
        });
      }
    });

    $("#periodWithdrawCldto").calendar({
      // minDate: new Date(),
      startCalendar: $("#periodWithdrawCldform"),
      type: "month",
      text: TextDateTH,
      formatter: formatter("monthOnly"),
      onChange: (date, ddmmyyyy) => {
        let amountMonth =
          // Math.round(moment(date).diff(this.monthStart, "months", true)) + 1;
          this.rentHouseForm.get("totalMonth").setValue('2');
        this.rentHouseForm.patchValue({
          periodWithdrawTo: ddmmyyyy
        });

        //sum totalWithdraw
        let salary = this.rentHouseForm.get("salary").value;
        // let totalMonth = this.rentHouseForm.get("totalMonth").value;
        this.rentHouseForm.get("totalWithdraw").setValue(salary * amountMonth);
      }
    });
  };

  //func check validator
  validateField(value: string) {
    return this.submitted && this.rentHouseForm.get(value).errors;
  }

  cbLoading = param => {
    this.loadingUL = param;
  };

  save(e) {
    e.preventDefault();
    this.submitted = true;
    // stop here if form is invalid
    if (this.rentHouseForm.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    this.msg.comfirm(confirm => {
      if (confirm) {
        this.loadingUL = true;
        this.selfService.save(this.rentHouseForm.value, this.cbLoading);
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }

  typeNumber(e) {
    return Utils.onlyNumber(e);
  }

  addReceiptRH() {
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    const form = this.rentHouseForm.get('receipts');
    const index = this.receiptsRH.controls.length;
    form.setValue(parseInt(form.value) + 1);
    this.receiptsRH.push(this.fb.group({
      receiptNo: ['', Validators.required],
      receiptAmount: ['', Validators.required],
      receiptDate: ['', Validators.required],
    }));
    setTimeout(() => {
      $(`#receiptD${index}`).calendar({
        type: "date",
        text: TextDateTH,
        formatter: formatter('day-month-year'),
        onChange: (date, text) => {
          this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
          this.receiptsRH.at(index).get(`receiptDate`).setValue(text);
        }
      });
    }, 400);
  }

  removeReceiptRH(index) {
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    const form = this.rentHouseForm.get('receipts');
    form.setValue(parseInt(form.value) - 1);
    this.receiptsRH.removeAt(index);
  }

  errorReceipt(index, control) {
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    return this.receiptsRH.at(index).get(control).invalid;
  }

  onUpload(e) {
    e.preventDefault();
    if ($("#files").val() === "") {
      this.msg.errorModal("กรุณาเลือกไฟล์อัปโหลด");
    } else {
      this.selfService.onUpload().then(data => {
        this.tableUpload = data;
      });
    }
  }

  onChangeFile() {
    this.flgOnLoad = false;
  }

  onDel(index: number) {
    this.loadingUL = true;
    this.selfService.onDel(index);
    setTimeout(() => {
      this.loadingUL = false;
    }, 300);
  }

  showSalary(e) {
    this.rentHouseForm.get("notOver").setValue(e.target.value);
  }

}
