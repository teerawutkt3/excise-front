import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'app/buckwaframework/project/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'app/buckwaframework/common/models/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { ResponseData } from 'app/buckwaframework/common/models/response-data.model';
import { MessageService } from 'app/buckwaframework/common/services/message.service';

@Component({
  selector: 'app-ta0201',
  templateUrl: './ta0201.component.html',
  styleUrls: ['./ta0201.component.css']
})
export class Ta0201Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b15.label, route: this.b.b15.route },
    { label: this.b.b12.label, route: this.b.b12.route }
  ];

  formPlan: FormGroup;
  submitted: boolean = false;
  yearPlan: any;
  checkPlanMas: boolean = false;
  getPlanData: any[];
  loading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private ajax: AjaxService
  ) { }

  // ======== Initial Setting ==================================
  ngOnInit() {
    this.yearPlan = Number(this.route.snapshot.queryParams["year"]);
    if (undefined == this.yearPlan) {

    }
    this.setFormPlan();
    this.getPlanMas();
  }

  setFormPlan() {
    this.formPlan = this.fb.group({
      month1: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month2: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month3: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month4: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month5: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month6: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month7: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month8: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month9: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month10: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month11: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month12: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      numTotal: null
    });
  }


  // ======== Action ==================================================
  validateFormModal(value: string) {
    let num = 0;
    for (let index = 0; index < 12; index++) {
      num = num + Number(this.formPlan.get(`month${index+1}`).value);
    }
    this.formPlan.get("numTotal").patchValue(num);
    return this.submitted && this.formPlan.get(value).errors;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formPlan.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    this.msg.comfirm(confirm => {
      if (confirm) {
        this.loading = true;
        const URL = "ta/plan-mas/insert/";
        let data = [
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 10,
            facNum: this.formPlan.get("month1").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 11,
            facNum: this.formPlan.get("month2").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 12,
            facNum: this.formPlan.get("month3").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 1,
            facNum: this.formPlan.get("month4").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 2,
            facNum: this.formPlan.get("month5").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 3,
            facNum: this.formPlan.get("month6").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 4,
            facNum: this.formPlan.get("month7").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 5,
            facNum: this.formPlan.get("month8").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 6,
            facNum: this.formPlan.get("month9").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 7,
            facNum: this.formPlan.get("month10").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 8,
            facNum: this.formPlan.get("month11").value
          },
          {
            planMasId: null,
            budgetYear: this.yearPlan,
            month: 9,
            facNum: this.formPlan.get("month12").value
          }
        ]
        if (this.checkPlanMas) {
          for (let index = 0; index < this.getPlanData.length; index++) {
            const element = this.getPlanData[index].planMasId;
            data[index].planMasId = element;
          }
        }
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
          } else {
            this.msg.errorModal(res.message);
          }
          this.loading = false;
        })
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }

  // ========== Call Backend ==========================================

  getPlanMas() {
    const URL = "ta/plan-mas/getplan/";
    let data = {
      budgetYear: this.yearPlan
    }
    this.loading = true;
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        const checkNull = null;
        let num = 0;
        if (checkNull != res.data) {
          this.checkPlanMas = true;
          this.getPlanData = res.data;
          this.getPlanData.sort(function(a, b) {
            if (Number(a.month) < Number(b.month)) {
              return -1;
            } else if (Number(b.month) < Number(a.month)) {
              return 1;
            } else {
              return 0;
            }
          })
          let num = 3;
          for (let index = num; index > 0; index--) {
            const element = this.getPlanData[this.getPlanData.length-1];
            this.getPlanData.splice(0, 0, element);
            this.getPlanData.pop();
          }
          for (let index = 0; index < this.getPlanData.length; index++) {
            const element = this.getPlanData[index];
            this.formPlan.get(`month${index+1}`).patchValue(element.facNum);
            num = num + element.facNum;
          }
          this.formPlan.get("numTotal").patchValue(num);
        }
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    });
  }
}
