import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { TextDateTH, formatter, ThDateToEnDate } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
// import moment = require('moment');

declare var $: any;
@Component({
  selector: 'app-int12070102',
  templateUrl: './int12070102.component.html',
  styleUrls: ['./int12070102.component.css']
})
export class Int12070102Component implements OnInit {
  breadcrumb: BreadCrumb[];

  medicalWelfareForm: FormGroup = new FormGroup({});

  flag: boolean = true;
  arrayUpload: any = [];
  fileArray: any = [];
  delFlag: boolean = false;
  submittedFlag: boolean = false;
  user: any;
  titleList: any[] = [];
  hospitalList: any[] = [];
  receipts: FormArray = new FormArray([], Validators.required);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private ajax: AjaxService,
    private message: MessageBarService,
    private router: Router
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "คำขอเบิก", route: "#" },
      { label: "ข้อมูลคำขอเบิก", route: "#" },
      { label: "บันทึกคำขอเบิกเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล (แบบ 7131)", route: "#" }
    ];
    this.medicalWelfareForm = this.fb.group({
      // Self
      fullName: [{ value: "", disabled: true }, Validators.required],
      position: [{ value: "", disabled: true }, Validators.required],
      affiliation: [{ value: "", disabled: true }, Validators.required],
      phoneNumber: [""],
      self: ["", Validators.required],

      // Couple
      couple: ["", Validators.required], // CheckBox
      titleCouple: [{ value: "" }],
      firstNameCouple: [{ value: "", disabled: true }],
      lastNameCouple: [{ value: "", disabled: true }],
      citizenIdCouple: [{ value: "", disabled: true }],

      // Father
      father: ["", Validators.required], // CheckBox
      titleFather: [{ value: "" }],
      firstNameFather: [{ value: "", disabled: true }],
      lastNameFather: [{ value: "", disabled: true }],
      citizenIdFather: [{ value: "", disabled: true }],

      // Mother
      mother: ["", Validators.required], // CheckBox
      titleMother: [{ value: "" }],
      firstNameMother: [{ value: "", disabled: true }],
      lastNameMother: [{ value: "", disabled: true }],
      citizenIdMother: [{ value: "", disabled: true }],

      // Children
      // Child 1
      child1: ["", Validators.required], // CheckBox
      titleChild1: [{ value: "" }],
      firstNameChild1: [{ value: "", disabled: true }],
      lastNameChild1: [{ value: "", disabled: true }],
      citizenIdChild1: [{ value: "", disabled: true }],
      birthDateChild1: [{ value: "", disabled: true }],
      numberOfChild1: [{ value: "", disabled: true }],
      statusChild1: [{ value: "", disabled: true }],

      // Child 2
      child2: ["", Validators.required], // CheckBox
      titleChild2: [{ value: "" }],
      firstNameChild2: [{ value: "", disabled: true }],
      lastNameChild2: [{ value: "", disabled: true }],
      citizenIdChild2: [{ value: "", disabled: true }],
      birthDateChild2: [{ value: "", disabled: true }],
      numberOfChild2: [{ value: "", disabled: true }],
      statusChild2: [{ value: "", disabled: true }],

      // Child 3
      child3: ["", Validators.required], // CheckBox
      titleChild3: [{ value: "" }],
      firstNameChild3: [{ value: "", disabled: true }],
      lastNameChild3: [{ value: "", disabled: true }],
      citizenIdChild3: [{ value: "", disabled: true }],
      birthDateChild3: [{ value: "", disabled: true }],
      numberOfChild3: [{ value: "", disabled: true }],
      statusChild3: [{ value: "", disabled: true }],

      // Reason
      disease: ["", Validators.required],
      hospitalName: ["", Validators.required],
      hospitalOwner: ["", Validators.required],
      treatedDateFrom: ["", Validators.required],
      treatedDateTo: ["", Validators.required],
      totalMoney: ["", Validators.required],
      receiptQuantity: [{ value: 0, disabled: true }, Validators.required],
      claimStatus: ["", Validators.required],
      claimMoney: ["", Validators.required],
      ownerClaim: [''],
      ownerClaim1: [''],
      ownerClaim2: [''],
      ownerClaim3: [''],
      ownerClaim4: [''],
      otherClaim: [''],
      otherClaim1: [''],
      otherClaim2: [''],
      otherClaim3: [''],
      otherClaim4: [''],
      files: [],
      type: [''],
      receipts: this.fb.array([], Validators.required)
    });
  }

  async ngOnInit() {

    this.user = await this.authService.reRenderVersionProgram('INT-06112');

    const { fullName, title, position } = this.user;
    this.medicalWelfareForm.patchValue({
      fullName: fullName,
      position: title,
      affiliation: position
    });

    this.titleList = await this.title(); // query list of dropdown from backend
    this.hospitalList = await this.hospital(); // query list of dropdown from backend
    $('.ui.dropdown.ai').dropdown().css('width', '100%');
    this.calendar();

  }

  ngAfterViewInit() {
    console.clear();
  }

  calendar = () => {
    let date = new Date();
    $("#dateFrom").calendar({
      type: "date",
      text: TextDateTH,
      endCalendar: $("#dateTo"),
      maxDate: new Date(),
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('treatedDateFrom').setValue(text);
      }
    });
    $("#dateTo").calendar({
      type: "date",
      text: TextDateTH,
      startCalendar: $("#dateFrom"),
      formatter: formatter('day-month-year'),
      maxDate: new Date(),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('treatedDateTo').setValue(text);
      }
    });
    $("#birthDate1").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('birthDateChild1').setValue(text);
      }
    });
    $("#birthDate2").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('birthDateChild2').setValue(text);
      }
    });
    $("#birthDate3").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('birthDateChild3').setValue(text);
      }
    });
  }

  addReceipt() {
    this.receipts = this.medicalWelfareForm.get('receipts') as FormArray;
    const form = this.medicalWelfareForm.get('receiptQuantity');
    form.patchValue(parseInt(form.value) + 1);
    const index = this.receipts.controls.length;
    this.receipts.push(this.fb.group({
      receiptNo: ['', Validators.required],
      receiptAmount: ['', Validators.required],
      receiptDate: ['', Validators.required]
    }, Validators.required));
    setTimeout(() => {
      $(`#receiptD${index}`).calendar({
        type: "date",
        text: TextDateTH,
        formatter: formatter('day-month-year'),
        onChange: (date, text) => {
          this.receipts = this.medicalWelfareForm.get('receipts') as FormArray;
          this.receipts.at(index).get(`receiptDate`).setValue(text);
        }
      });
    }, 400);
  }

  removeReceipt(index) {
    this.receipts = this.medicalWelfareForm.get('receipts') as FormArray;
    const form = this.medicalWelfareForm.get('receiptQuantity');
    form.patchValue(parseInt(form.value) - 1);
    this.receipts.removeAt(index);
  }

  onFilesAdded() {
    this.flag = false;
  }

  onUpload(e) {
    e.preventDefault();
    if ($("#files").val() === "") {
      this.message.errorModal("กรุณาเลือกไฟล์อัพโหลด");
    } else {
      this.fileUpload().then(res => {
        this.arrayUpload = res;
      });
    }
  }

  fileUpload() {
    let inputFile = `<input type="file" name="files" id="files" accept=".pdf, image/*, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        application/vnd.ms-excel,.doc,.docx">`;

    let f = $(".upload-panel > input")[0];
    $(".upload-panel").html(inputFile);

    let lastText = f.value.split("\\").length;
    let u = {
      name: f.value.split("\\")[lastText - 1],
      date: new Date().toLocaleDateString(),
      typePage: "RH",
      inputFile: f
    };

    this.fileArray.push(u);

    return new Promise<any>((resolve, reject) => {
      resolve(this.fileArray);
    });
  }

  onDeleteRow(index: number) {
    this.message.comfirm(e => {
      if (e) {
        this.delFlag = true;
        this.fileArray.splice(index, 1);
        setTimeout(() => {
          this.delFlag = false;
        }, 300);
      }
    }, "ต้องการเปลี่ยนแปลงข้อมูลหรือไม่?");
  }

  onSubmit() {
    this.delFlag = true;
    this.submittedFlag = true;
    if (this.medicalWelfareForm.invalid || this.medicalWelfareForm.get('receiptQuantity').value == 0) {
      for (let key in this.medicalWelfareForm.controls) {
        if (this.medicalWelfareForm.get(key).invalid) {
          if (AjaxService.isDebug) {
            console.error("REQUIRED : " + key);
          }
          this.message.errorModal("กรุณากรอกข้อมูลให้ครบ");
          return;
        }
      }
    }
    this.message.comfirm(confirm => {
      const form = this.medicalWelfareForm;
      if (confirm) {
        if (form.get('statusChild1').value == '0') {
          const date = ''// moment(ThDateToEnDate(form.get('birthDateChild1').value), "DD/MM/YYYY");
          if (true) {//moment().diff(date, 'years') > 20
            this.message.errorModal("กรุณากรอกข้อมูลอายุให้ถูกต้อง");
            return;
          }
        }
        if (form.get('statusChild2').value == '0') {
          const date = '' //moment(ThDateToEnDate(form.get('birthDateChild2').value), "DD/MM/YYYY");
          if (true) {//moment().diff(date, 'years') > 20
            this.message.errorModal("กรุณากรอกข้อมูลอายุให้ถูกต้อง");
            return;
          }
        }
        if (form.get('statusChild3').value == '0') {
          const date = '' //moment(ThDateToEnDate(form.get('birthDateChild3').value), "DD/MM/YYYY");
          if (true) {//moment().diff(date, 'years') > 20
            this.message.errorModal("กรุณากรอกข้อมูลอายุให้ถูกต้อง");
            return;
          }
        }
        this.medicalWelfareForm.enable();
        const {
          fullName, position, affiliation, phoneNumber, disease, hospitalName, hospitalOwner,
          treatedDateFrom, treatedDateTo, totalMoney, receiptQuantity, claimStatus, claimMoney,
          citizenIdCouple, firstNameCouple, lastNameCouple, titleCouple, firstNameFather, lastNameFather,
          titleFather, citizenIdFather, firstNameMother, lastNameMother, titleMother, citizenIdMother,
          firstNameChild1, lastNameChild1, titleChild1, citizenIdChild1, statusChild1, statusChild2,
          statusChild3, birthDate1, birthDate2, birthDate3, numberOfChild1, numberOfChild2, numberOfChild3,
          ownerClaim1, ownerClaim2, ownerClaim3, ownerClaim4, otherClaim1, otherClaim2, otherClaim3, otherClaim4,
          receipts
        } = this.medicalWelfareForm.value;
        let otherClaimArr = [];
        let ownerClaimArr = [];
        otherClaim1 ? otherClaimArr.push("0") : [];
        otherClaim2 ? otherClaimArr.push("1") : [];
        otherClaim3 ? otherClaimArr.push("2") : [];
        otherClaim4 ? otherClaimArr.push("3") : [];
        ownerClaim1 ? ownerClaimArr.push("0") : [];
        ownerClaim2 ? ownerClaimArr.push("1") : [];
        ownerClaim3 ? ownerClaimArr.push("2") : [];
        ownerClaim4 ? ownerClaimArr.push("3") : [];
        this.medicalWelfareForm.get('otherClaim').setValue(otherClaimArr.join(","));
        this.medicalWelfareForm.get('ownerClaim').setValue(ownerClaimArr.join(","));
        const mateName = titleCouple + ' ' + firstNameCouple + ' ' + lastNameCouple;
        const fatherName = titleFather + ' ' + firstNameFather + ' ' + lastNameFather;
        const motherName = titleMother + ' ' + firstNameMother + ' ' + lastNameMother;
        const childName = titleChild1 + ' ' + firstNameChild1 + ' ' + lastNameChild1;
        const data = {
          fullName, position, affiliation, phoneNumber, disease, hospitalName, hospitalOwner,
          treatedDateFrom, treatedDateTo, totalMoney, receiptQt: receiptQuantity, claimStatus,
          claimMoney, ownerClaim: this.medicalWelfareForm.get('ownerClaim').value,
          otherClaim: this.medicalWelfareForm.get('otherClaim').value, mateName, mateCitizenId: citizenIdCouple,
          fatherName, fatherCitizenId: citizenIdFather, motherName, motherCitizenId: citizenIdMother, childName,
          childCitizenId: citizenIdChild1, status: statusChild1, status2: statusChild2, status3: statusChild3,
          gender: '', birthDate: birthDate1, birthDate2, birthDate3, siblingsOrder: numberOfChild1,
          siblingsOrder2: numberOfChild2, siblingsOrder3: numberOfChild3
        }
        const url = "ia/int061102/save";
        this.ajax.post(url, data, res => {
          const data = res.json();
          if (Utils.isNotNull(data.id)) {
            const formData = new FormData();
            formData.append("id", data.id);

            this.fileArray.forEach(file => {
              formData.append("files", file.inputFile.files[0]);
            });

            let _receipts = receipts;
            for (let key in _receipts) {
              _receipts[key].id = data.id;
              _receipts[key].receiptDate = '' //moment(_receipts[key].receiptDate, "DD/MM/YYYY").toDate();
              _receipts[key].receiptType = "MD";
            }

            const urlUpload = "ia/int061102/upload";
            this.ajax.upload(urlUpload, formData, _data => {

              const urlReceipt = "ia/int061102/receipt/save";
              this.ajax.post(urlReceipt, _receipts, response => {
                this.message.successModal(response.json().messageTh);
                this.router.navigate(["/int12/07/01"]);
              }).catch(err => {
                this.message.errorModal("ไม่สามารถทำการบันทึกได้");
                console.error(err);
              });
            }).catch(err => {
              this.message.errorModal("ไม่สามารถทำการบันทึกได้");
              console.error(err);
            });
          }
        }).catch(err => {
          this.message.errorModal("ไม่สามารถทำการบันทึกได้");
          console.error(err);
        });
      }
    }, "ยืนยันการบันทึกข้อมูล");

  }


  handleCheckBox() {
    let count = 0;
    const form = this.medicalWelfareForm;
    if (form.get('self').value) { count++ }
    if (form.get('couple').value) { count++ }
    if (form.get('father').value) { count++ }
    if (form.get('mother').value) { count++ }
    if (form.get('child1').value) { count++ }
    if (form.get('child2').value) { count++ }
    if (form.get('child3').value) { count++ }
    if (count > 0) {
      form.get('self').clearValidators(); form.get('self').updateValueAndValidity();
      form.get('couple').clearValidators(); form.get('couple').updateValueAndValidity();
      form.get('father').clearValidators(); form.get('father').updateValueAndValidity();
      form.get('mother').clearValidators(); form.get('mother').updateValueAndValidity();
      form.get('child1').clearValidators(); form.get('child1').updateValueAndValidity();
      form.get('child2').clearValidators(); form.get('child2').updateValueAndValidity();
      form.get('child3').clearValidators(); form.get('child3').updateValueAndValidity();
    } else {
      form.get('self').setValidators([Validators.required]); form.get('self').updateValueAndValidity();
      form.get('couple').setValidators([Validators.required]); form.get('couple').updateValueAndValidity();
      form.get('father').setValidators([Validators.required]); form.get('father').updateValueAndValidity();
      form.get('mother').setValidators([Validators.required]); form.get('mother').updateValueAndValidity();
      form.get('child1').setValidators([Validators.required]); form.get('child1').updateValueAndValidity();
      form.get('child2').setValidators([Validators.required]); form.get('child2').updateValueAndValidity();
      form.get('child3').setValidators([Validators.required]); form.get('child3').updateValueAndValidity();
    }
  }

  // Ajax Dropdown
  title = () => {
    let url = "ia/int06101/title"
    return this.ajax.post(url, {}, res => {
      this.titleList = res.json();
      return res.json();
    })
  }

  //Ajax Dropdown
  hospital = () => {
    let url = "ia/int061102/hospital"
    return this.ajax.get(url, res => {
      this.hospitalList = res.json();
      return res.json();
    })
  }

  error(control) {
    return this.medicalWelfareForm.get(control).invalid && this.submittedFlag;
  }

  errorReceipt(index, control) {
    return this.receipts.at(index).get(control).invalid && this.submittedFlag;
  }

  canDisabled(ref, control) {
    if (this.medicalWelfareForm.get(ref).value) {
      this.medicalWelfareForm.get(control).enable();
      this.medicalWelfareForm.get(control).setValidators([Validators.required]);
      this.medicalWelfareForm.get(control).updateValueAndValidity();
      return false;
    }
    return true;
  }

}

class MedicalReceipt {
  receiptId: number;
  receiptNo: string;
  receiptAmount: number;
  receiptType: string;
  receiptDate: Date;
  id: number;
}
