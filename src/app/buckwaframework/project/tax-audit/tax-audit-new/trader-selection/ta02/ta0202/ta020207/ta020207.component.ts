import { Component, OnInit } from '@angular/core';
import { ResponseData } from 'models/index';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { IaService } from 'services/ia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { FactoryVo } from '../factory';
declare var $: any;

const URL = {
  FIND_BY_NEW_REG_ID: "ta/tax-audit/find-by-new-reg-id"
}

@Component({
  selector: 'app-ta020207',
  templateUrl: './ta020207.component.html',
  styleUrls: ['./ta020207.component.css']
})
export class Ta020207Component implements OnInit {

  newRegId: string = "";
  formGroup: FormGroup;

  actived: boolean[] = [true, false, false, false, false, false, false, false, false, false, false];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private modelService: IaService,
    private formBuilder: FormBuilder,
  ) { }

  // ====================== Initial Setting =====================
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      newRegId: [''],
      cusFullname: [''],
      facFullname: [''],
      facAddress: [''],
      secDesc: [''],
      areaDesc: [''],
      dutyDesc: ['']
    });
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    this.setData(this.newRegId);
    if (this.newRegId) {
      this.setData(this.newRegId);
    } else {
      this.router.navigate(["/tax-audit-new/ta02/02"]);
    }
  }

  setData(id: String) {
    if (id) {
      this.ajax.doGet(`${URL.FIND_BY_NEW_REG_ID}/${id}`).subscribe((result: ResponseData<FactoryVo>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.formGroup.get('newRegId').patchValue(result.data.newRegId);
          this.formGroup.get('cusFullname').patchValue(result.data.cusFullname);
          this.formGroup.get('facFullname').patchValue(result.data.facFullname);
          this.formGroup.get('facAddress').patchValue(result.data.facAddress);
          this.formGroup.get('secDesc').patchValue(result.data.secDesc);
          this.formGroup.get('areaDesc').patchValue(result.data.areaDesc);
          this.formGroup.get('dutyDesc').patchValue(result.data.dutyDesc);
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
    }
  }

  // ========================= Action ========================
  goTo(link: string, linkNumber: number) {
    this.onActice(linkNumber);
    this.router.navigate([link], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
  }

  onActice(linkNumber: number) {
    this.actived = [false, false, false, false, false, false, false, false, false, false, false];
    this.actived[linkNumber] = true;
  }

}
