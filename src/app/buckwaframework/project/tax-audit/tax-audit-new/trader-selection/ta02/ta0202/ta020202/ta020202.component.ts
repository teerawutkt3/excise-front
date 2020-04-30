import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { IaService } from 'services/ia.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { FactoryVo } from '../factory';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AuthService } from 'services/auth.service';

declare var $: any;

const URL = {
  FIND_BY_NEW_REG_ID: "ta/tax-audit/find-by-new-reg-id"
}

@Component({
  selector: 'app-ta020202',
  templateUrl: './ta020202.component.html',
  styleUrls: ['./ta020202.component.css']
})
export class Ta020202Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'วิเคราะห์ข้อมูลเบื้องต้น', route: '#' }
  ];

  hideResult: boolean = false;
  loading: boolean = false;

  formGroup: FormGroup;
  checkSearchFlag: boolean = false;

  newRegId: string = "";
  actived: boolean[] = [true, false, false, false, false, false, false, false];

  note: string;
  regDutyList: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private modelService: IaService,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.setFormGroup();
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    if (this.newRegId) {
      this.searchNewRegId();
    } else {
      this.router.navigate(["/tax-audit-new/ta02/02/01"]);
    }
  }

  ngAfterViewInit(): void {
    this.calendar();
    this.callDropDown();
  }

  setFormGroup() {
    this.formGroup = this.formBuilder.group({
      newRegId: [''],
      cusFullname: [''],
      facFullname: [''],
      facAddress: [''],
      secDesc: [''],
      areaDesc: [''],
      dutyDesc: [''],
      jobResp: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          startDate: text
        })
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          endDate: text
        })
      }
    });
  }

  callDropDown = () => {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 100);
  }

  onSearch() {
    this.hideResult = false;
    this.checkSearchFlag = true;
    if (this.formGroup.value.startDate && this.formGroup.value.endDate) {
      setTimeout(() => {
        this.loading = false;
        this.hideResult = true;
        this.router.navigate(["/tax-audit-new/ta02/02/02/01"], {
          queryParams: {
            newRegId: this.newRegId,
            dutyDesc: this.formGroup.get('dutyDesc').value
          }
        });
      }, 1000);
      this.modelService.setData(this.formGroup.value);
      console.log("model service : ", this.modelService.getData());
      this.loading = true;
    }
  }

  onBackPages() {
    this.router.navigate(["/tax-audit-new/ta02/02/01"], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
  }

  goTo(link: string, numLink: number) {
    this.onActive(numLink);
    this.router.navigate([link], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
  }

  onActive(numLink: number) {
    this.actived = [false, false, false, false, false, false, false, false];
    this.actived[numLink] = true;
  }

  // setData(id: String) {
  //   if (id) {
  //     this.ajax.doGet(`${URL.FIND_BY_NEW_REG_ID}/${id}`).subscribe((result: ResponseData<FactoryVo>) => {
  //       if (MessageService.MSG.SUCCESS == result.status) {
  //         let jobResp = this.auth.getUserDetails().userThaiName+" "+this.auth.getUserDetails().userThaiSurname;
  //         this.formGroup.get('newRegId').patchValue(result.data.newRegId);
  //         this.formGroup.get('cusFullname').patchValue(result.data.cusFullname);
  //         this.formGroup.get('facFullname').patchValue(result.data.facFullname);
  //         this.formGroup.get('facAddress').patchValue(result.data.facAddress);
  //         this.formGroup.get('secDesc').patchValue(result.data.secDesc);
  //         this.formGroup.get('areaDesc').patchValue(result.data.areaDesc);
  //         this.formGroup.get('dutyDesc').patchValue(result.data.dutyDesc);
  //         this.formGroup.get('jobResp').patchValue(jobResp);
  //       } else {
  //         this.messageBar.errorModal(result.message);
  //       }
  //     });
  //   }
  // }

  // ================ Action ==================
  reset() {
    this.formGroup.get('startDate').reset();
    this.formGroup.get('endDate').reset();
    this.hideResult = false;
    this.checkSearchFlag = false;
  }

  resetNote() {
    this.note = "";
  }

  invalidSearchFormControl(control: string) {
    return this.formGroup.get(control).invalid && (this.formGroup.get(control).touched || this.checkSearchFlag);
  }

  detailModal() {
    $('#detailModal').modal('show');
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.newRegId);
    this.getOperatorDetails(this.newRegId);
  }

  // ============ call back-end ================
  getOperatorDetails(newRegId: string) {
    const URL = "ta/tax-audit/get-operator-details";
    this.loading = true;
    this.ajax.doPost(URL, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data);
        let jobResp = this.auth.getUserDetails().userThaiName+" "+this.auth.getUserDetails().userThaiSurname;
        this.formGroup.get('newRegId').patchValue(res.data.newRegId);
        this.formGroup.get('cusFullname').patchValue(res.data.cusFullname);
        this.formGroup.get('facFullname').patchValue(res.data.facFullname);
        this.formGroup.get('facAddress').patchValue(res.data.facAddress);
        this.formGroup.get('secDesc').patchValue(res.data.secDesc);
        this.formGroup.get('areaDesc').patchValue(res.data.areaDesc);
        this.formGroup.get('dutyDesc').patchValue(res.data.regDutyList[0].groupName);
        this.formGroup.get('jobResp').patchValue(jobResp);
        this.regDutyList = res.data.regDutyList;
        setTimeout(() => {
          $('.dutyDesc').dropdown('set selected', res.data.regDutyList[0].groupName);
        }, 500);
        console.log("formGroup : ", this.formGroup.value);
        this.callDropDown();
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.loading = false;
    });
  }

}
