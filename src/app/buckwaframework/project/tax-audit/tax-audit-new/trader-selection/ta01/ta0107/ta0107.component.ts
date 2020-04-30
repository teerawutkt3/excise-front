import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { Location } from '@angular/common';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { AuthService } from 'app/buckwaframework/common/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextDateTH, formatter } from 'app/buckwaframework/common/helper/datepicker';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { forEach } from '@angular/router/src/utils/collection';

declare var $: any;

@Component({
  selector: 'app-ta0107',
  templateUrl: './ta0107.component.html',
  styleUrls: ['./ta0107.component.css']
})
export class Ta0107Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();

  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b04.label, route: this.b.b04.route }
  ]
  checkoffice: boolean = false;
  approver: FormGroup;
  formYear: FormGroup;
  selected: any;
  selectSector: any[];
  planWsSendData: any[];
  planWsSendDataAll: any[];
  loading: boolean = false;
  showDescApprove: boolean = false;
  toggleButtonTxt: string = 'แสดงความเห็น';
  planStatus: any = { planStatus: "", planStatusDesc: "", approvalComment: "", approvedComment: "" };
  officeCode: any;
  auditStatus:boolean = true;

  constructor(
    private _location: Location,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private userDetail: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.formYear = this.fb.group({
      budgetYear: ["", Validators.required]
    });
  }


  // ============ Initial setting =================
  ngOnInit() {
    this.auditStatus = true;
    this.officeCode = this.userDetail.getUserDetails().officeCode;
    console.log("this.officeCode : ", this.officeCode);
    if (this.officeCode == '001401') {
      this.checkoffice = true;
    } else {
      this.checkoffice = false;
    }
    console.log(this.userDetail.getRole());
    this.selected = "0";
    this.setApproveForm();
    let currYear
    let currMonth = new Date().getMonth() + 1;
    if (currMonth >= 8 && currMonth <= 12) {
      currYear = new Date().getFullYear() + 543 + 1;
    } else {
      currYear = new Date().getFullYear() + 543;
    }
    this.formYear.get("budgetYear").patchValue(currYear);
    this.getPlanWsSend();
    this.getSectorList();
    this.getPlanStatus();

  }

  setApproveForm() {
    this.approver = this.fb.group({
      approvalComment: ["", Validators.required],
      approvedComment: ["", Validators.required]
    })
  }

  ngAfterViewInit(): void {
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date) => {
        let newYear = moment(date).year() + 543;
        this.formYear.get("budgetYear").patchValue(newYear);
      }
    });
    console.log("year : ", this.formYear.value);
    $('.ui.dropdown').dropdown().css('min-width', '3em');

  }

  callDropDown() {
    setTimeout(() => {
      $("selectSector").dropdown();
    }, 200);
  }

  setFormYear() {
  }

  // ================= Action ========================

  checkRole = (compare: string) => {
    return this.userDetail.getRole().some(e => e == compare);
  }

  search() {
    // this.setFormYear()
    console.log("this.formYear : ", this.formYear.value);
    this.getPlanWsSend();
    this.getSectorList();
  }

  onChange() {
    console.log('onChange')
    let checkSelected = "0";
    if (checkSelected == this.selected) {
      this.planWsSendData = this.planWsSendDataAll;
    } else {
      this.planWsSendData = this.planWsSendDataAll.filter((obj) => {
        return obj.planWorksheetSend.officeCode.slice(0, 2) == this.selected.slice(0, 2)
      });
      console.log("onChange PlanWsSend : ", this.planWsSendData);
    }

  }

  onClickDetail(officeCode) {
    console.log('onClickDetail officeCode', officeCode)
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: officeCode
      }
    });
  }

  onApproved(num: number) {
    this.msg.comfirm(confirm => {
      this.loading = true;
      const URL = "ta/tax-operator/update-plan-comment/";
      let data = {
        budgetYear: this.formYear.get("budgetYear").value,
        approvalComment: this.approver.value.approvalComment,
        approvedComment: this.approver.value.approvedComment
      }
      if (num == 0) {
        data = {
          budgetYear: this.formYear.get("budgetYear").value,
          approvalComment: this.approver.value.approvalComment,
          approvedComment: null
        }
      } else {
        data = {
          budgetYear: this.formYear.get("budgetYear").value,
          approvalComment: null,
          approvedComment: this.approver.value.approvedComment
        }
      }
      if (confirm) {
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
            this.getPlanStatus();
          } else {
            this.msg.errorModal(res.message);
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }, "ยืนยันการบันทึกข้อมูล");

  }

  toggleHideButton() {
    if (this.showDescApprove) {
      this.showDescApprove = false;
      this.toggleButtonTxt = 'แสดงความเห็น'
    } else {
      this.showDescApprove = true;
      this.toggleButtonTxt = 'ซ่อนความเห็น'
    }
  }

  // ======================= Call backend ===============

  getPlanWsSend() {
    console.log("this.formYear.value :", this.formYear.value);
    this.loading = true;
    const URL = "ta/tax-operator/get-plan-ws-send/";
    this.ajax.doPost(URL, this.formYear.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.planWsSendData = res.data.sort(function (a, b) {
          if (Number(a.planWorksheetSend.officeCode) < Number(b.planWorksheetSend.officeCode)) {
            return -1;
          } else if (Number(b.planWorksheetSend.officeCode) < Number(a.planWorksheetSend.officeCode)) {
            return 1;
          } else {
            return 0;
          }
        });

        this.planWsSendData.forEach(element => {
          if (element.submitDate){
            this.auditStatus = false;
          }

        });

        console.log("getPlanWsSend : ", this.planWsSendData);
        this.planWsSendDataAll = this.planWsSendData;
        //search selectSector
        this.selected = this.officeCode;
        if ("00" == this.selected.slice(0, 2)) {
          this.selected = "0";
        }
        this.onChange();
      } else {
        this.msg.errorModal(res.message);
        console.log("Error getPlanWsSend : ")
      }
      this.loading = false;
    })
  }

  getSectorList() {
    const URL = "preferences/department/sector-list/";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.selectSector = res.data.sort(function (a, b) {
          if (Number(a.officeCode) < Number(b.officeCode)) {
            return -1;
          } else if (Number(b.officeCode) < Number(a.officeCode)) {
            return 1;
          } else {
            return 0;
          }
        })
      } else {
        this.msg.errorModal(res.message);
        console.log("Error getSectorList : ")
      }
    })
  }

  getPlanStatus() {
    const URL = "ta/tax-operator/get-plan-status/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.planStatus = res.data;
          if (null != this.planStatus.approvalComment) {
            this.approver.get("approvalComment").patchValue(this.planStatus.approvalComment);
          }
          if (null != this.planStatus.approvedComment) {
            this.approver.get("approvedComment").patchValue(this.planStatus.approvedComment);
          }
        }
      } else {
        this.msg.errorModal(res.message);
        console.log("Error getPlanStatus : ")
      }
    })
  }

}
