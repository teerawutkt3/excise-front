import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AjaxService } from 'services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/index';
import { TextDateTH, Utils } from 'helpers/index';
import { formatter } from 'helpers/index';
import { ResponseData } from 'models/index';
import { FactoryVo } from '../../ta0202/factory';
import { MessageService } from 'services/index';
declare var $: any;

const URL = {
  FIND_BY_NEW_REG_ID: "ta/tax-audit/find-by-new-reg-id"
}


@Component({
  selector: 'app-ta020501',
  templateUrl: './ta020501.component.html',
  styleUrls: ['./ta020501.component.css']
})
export class Ta020501Component implements OnInit {

  button: boolean = false;
  loader: boolean = false;

  newRegId: string = "";
  // form
  dataForm: FormGroup;

  auditType: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
  ) { }


  ngOnInit() {
   
    this.getTaAuditType();
    this.dataForm = new FormGroup({
      newRegId: new FormControl(''),
      cusFullname: new FormControl(''),
      facFullname: new FormControl(''),
      facAddress: new FormControl(''),

      // secDesc: new FormControl(''),
      // areaDesc: new FormControl(''),
      dutyDesc: new FormControl(''),
      auditType: new FormControl(''),
      auditStartDate: new FormControl(''),
      auditEndDate: new FormControl(''),


    });
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    this.setData(this.newRegId);
    if (this.newRegId) {
      this.setData(this.newRegId);
    } else {
      this.router.navigate(["/tax-audit-new/ta02/05"]);
    }
  }

  routePage(){
    if (this.dataForm.get('auditType').value == 'M') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          newRegId: this.newRegId,
          page:"05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'F') {
   
      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          newRegId: this.newRegId,
          page:"05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'D') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/04/01'], {
        queryParams: {
          newRegId: this.newRegId,
          page:"05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'S') {
    
      this.router.navigate(['/tax-audit-new/ta02/02/01/05/01'], {
        queryParams: {
          newRegId: this.newRegId,
          page:"05"
        }
      });
    } else { }
  }
  ngAfterViewInit(): void {
   
    this.calenda();
  }

  calenda = () => {
    $("#auditStartDate").calendar({
      endCalendar: $("#auditEndDate"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.dataForm.get("auditStartDate").patchValue(text);
      }
    });
    $("#auditEndDate").calendar({
      startCalendar: $("#auditStartDate"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.dataForm.get("auditEndDate").patchValue(text);
      }
    });
  }

  goTo(link: string) {
    this.router.navigate([link], {
      queryParams: {
        newRegId: this.newRegId,
        page:"05"
      }
    });
  }
  setData(id: String) {
    if (id) {
      this.loader = true;
      this.ajax.doGet(`${URL.FIND_BY_NEW_REG_ID}/${id}`).subscribe((result: ResponseData<FactoryVo>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.dataForm.get('newRegId').patchValue(result.data.newRegId);
          this.dataForm.get('cusFullname').patchValue(result.data.cusFullname);
          this.dataForm.get('facFullname').patchValue(result.data.facFullname);
          this.dataForm.get('facAddress').patchValue(result.data.facAddress);
          // this.dataForm.get('secDesc').patchValue(result.data.secDesc);
          // this.dataForm.get('areaDesc').patchValue(result.data.areaDesc);
          this.dataForm.get('dutyDesc').patchValue(result.data.dutyDesc);
          this.dataForm.get('auditType').patchValue(result.data.auditType);
          $('.auditType').dropdown('set selected', result.data.auditType);
          this.dataForm.get('auditStartDate').patchValue(result.data.auditStartDate);
          this.dataForm.get('auditEndDate').patchValue(result.data.auditEndDate);
          if(Utils.isNotNull(this.dataForm.get('auditType').value)){
            this.routePage();
           
            
          }
        } else {
          this.messageBar.errorModal(result.message);
        }
        this.loader = false;
      });
    }
  }

  // ============== Action ==========================
  save() {
    const URL = "ta/tax-audit/update-plan-ws-dtl";
    this.loader = true;
    this.ajax.doPost(URL, this.dataForm.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.routePage();
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.loader = false;
    })

  }

  // =================== call back-end ===================
  getTaAuditType() {
    const URL = "preferences/parameter/TA_AUDIT_TYPE";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditType = [];
        this.auditType = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

}