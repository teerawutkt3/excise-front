import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { Router } from '@angular/router';
import { Ope0202, Ope0202Vo } from 'projects/operation-audit/ope02/ope0202/ope0202vo.model';
import { AjaxService, MessageService } from 'services/index';
import { MessageBarService } from 'services/index';
import * as moment from 'moment';

const URL = {
  GET_FIND: "oa/04/02/findAll",
  PUT_STATUS: "oa/04/02/status"
}

@Component({
  selector: 'app-ope0402',
  templateUrl: './ope0402.component.html',
  styleUrls: ['./ope0402.component.css']
})
export class Ope0402Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "รายการออกตรวจ", route: "#" },
  ];
  lists: Ope0202[] = [];
  constructor(
    private router: Router,
    private ajaxService: AjaxService,
    private msg: MessageBarService
  ) { }

  ngOnInit() {
    this.callApis();
  }

  async callApis() {
    await this.findAll(1);
    await this.findAll(2);
    await this.findAll(3);
  }

  checkout(id: string) {
    this.ajaxService.doPut(`${URL.PUT_STATUS}/${id}`, {}).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.router.navigate(['/ope04/01/06/'], {
          queryParams: {
            id: id
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  findAll(day: number) {
    return new Promise((resolve) => {
      this.ajaxService.doGet(`${URL.GET_FIND}/${day}`).subscribe((response: ResponseData<Ope0202Vo[]>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          const data: number = this.lists.findIndex((obj: Ope0202) => obj.day == day - 1);
          if (data != -1) {
            this.lists[data].details = response.data;
          } else {
            this.lists.push({
              day: day - 1,
              date: moment().add(day - 1, 'days').toDate(),
              details: response.data
            });
            let indexs: number[] = [];
            for (let i = 0; i < this.lists.length; i++) {
              if (this.lists[i].day != day - 1) {
                for (let j = 0; j < this.lists[i].details.length; j++) {
                  for (let k = 0; k < this.lists[this.lists.length - 1].details.length; k++) {
                    if (this.lists[i].details[j].oaLicensePlanId == this.lists[this.lists.length - 1].details[k].oaLicensePlanId) {
                      let index: number = indexs.findIndex(obj => obj == this.lists[this.lists.length - 1].details[k].oaLicensePlanId);
                      if (index == -1) {
                        indexs.push(this.lists[this.lists.length - 1].details[k].oaLicensePlanId);
                      }
                    }
                  }
                }
              }
            }
            for (let i = 0; i < indexs.length; i++) {
              const idx: number = this.lists[this.lists.length - 1].details.findIndex(obj => obj.oaLicensePlanId == indexs[i]);
              if (idx != -1) {
                this.lists[this.lists.length - 1].details.splice(idx, 1);
              }
            }
          }
          resolve(true);
        } else {
          this.msg.errorModal(response.message);
        }
      }, error => {
        // TODO ERROR
      });
    });
  }

}

