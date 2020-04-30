import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { Observable } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ta0106',
  templateUrl: './ta0106.component.html',
  styleUrls: ['./ta0106.component.css']
})
export class Ta0106Component implements OnInit, AfterViewInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b11.label, route: this.b.b11.route }
  ];

  table: any;
  budgetYear: any = '';
  planNumber: any = '';
  analysisNumber: any = '';
  disabledButton: boolean = false;
  disabledButton1: boolean = false;
  disabledButton2: boolean = false;
  loading: boolean = false;
  subdeptLevel: any;
  objMonth:any;
  anlNumber :string;
  sector:any;
  area:any;
  isChild:boolean = false;
  buttonName:string = "ส่งต่อพื้นที่";
  constructor(
    private userDetail: AuthService,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
  ) { 
    this.objMonth = {
      yearMonthStart:"",
      yearMonthEnd:""
    }
  }


  // ==> app function start
  ngOnInit() {
    this.anlNumber = this.route.snapshot.queryParams["analysisNumber"];
    this.subdeptLevel = this.userDetail.getUserDetails().subdeptLevel;
    this.userDetail.getUserDetails().officeCode;
    this.userDetail.getUserDetails().subdeptCode
    console.log("this.subdeptLevel : ",this.userDetail.getUserDetails());
    this.sector = this.userDetail.getUserDetails().departmentName;
    this.getMonthStart(this.anlNumber);
    console.log(this.disabledButton1);
    // this.getSector();
    // this.chekcIsChlid();
  }

  ngAfterViewInit(): void {
    this.getBudgetYear().subscribe((resbudgetYear: ResponseData<any>) => {
      console.log("Budget Year : ", resbudgetYear);
      this.budgetYear = resbudgetYear;
      this.getPlanNumber(resbudgetYear).subscribe((resPlanAndAnalysis: any) => {
        if (resPlanAndAnalysis != null) {
          this.planNumber = resPlanAndAnalysis.planNumber;
          this.analysisNumber = resPlanAndAnalysis.analysisNumber;
        }
        this.checkSubmitDatePlanWorksheetSend(this.planNumber).subscribe(res => {
          this.tablePlan();
          // if (this.subdeptLevel == 1) {
          //   this.disabledButton1 = false;
          // } if(this.subdeptLevel == 2 || this.subdeptLevel == 3) {
          //   this.disabledButton1 = true;
          //   console.log(this.disabledButton);
          //   if (this.disabledButton != null)
          //     this.disabledButton1 = this.disabledButton
          // }
          if (this.subdeptLevel == 1 || this.subdeptLevel == null) {
            this.disabledButton1 = false;
            if (this.disabledButton != null) {
              this.disabledButton1 = this.disabledButton
            }
            console.log("this.disabledButton1555 : ", this.disabledButton1);
          } if (this.subdeptLevel == 2 || this.subdeptLevel == 3) {
            this.disabledButton1 = true;
          }

          this.chekcIsChlid();
        });
      });
    });

    console.log("this.disabledButton :", this.disabledButton);

  }

  tablePlan = () => {
    console.log("datatable call");
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl";
    this.table = $("#tablePlan").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            planNumber: this.planNumber
          }));
        }
      },
      columns: [
        {
          render: (data, type, full, meta) => {
            let disBtn = this.disabledButton ? 'disabled' : '';
            return `<button class="ui mini red button delete icon" type="button" ${disBtn}>
                    <i class="trash icon"></i>
                  </button>`;
          }
        }, {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "newRegId", className: "text-left"
        }, {
          data: "cusFullname", className: "text-left"
        }, {
          data: "facFullname", className: "text-left"
        }, {
          data: "facAddress", className: "text-left"
        }, {
          data: "secDesc", className: "text-left"
        }, {
          data: "areaDesc", className: "text-left"
        }, {
          data: "dutyDesc", className: "text-left"
        }
      ]
    });

    this.table.on("click", "td > button.delete", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.messageBar.comfirm(res => {
        if (res) {
          this.onDelete(data.newRegId);
        }
      }, "ยืนยันการทำรายการ");
    });
  }

  onSave() {
    // console.log("onSave : ");
    // if (this.disabledButton1 == false) {
    if (this.isChild == false) {
      this.messageBar.comfirm(res => {
        if (res) {
          this.loading = true;
          this.ajax.doPost("ta/tax-operator/save-plan-worksheet-send", {
            budgetYear: this.budgetYear,
            planNumber: this.planNumber,
            analysisNumber: this.analysisNumber

          }).subscribe((res: ResponseData<any>) => {

            this.disabledButton1 = true;
            if (MessageService.MSG.SUCCESS == res.status) {
              this.messageBar.successModal(res.message);
              this.checkSubmitDatePlanWorksheetSend(this.planNumber).subscribe(res => {
                this.table.ajax.reload();
              });
            } else {
              this.messageBar.errorModal(res.message);
              console.log("Error onSave!");
            }
            this.loading = false;
          });
        }
      }, "ยันยืนการทำรายการ")
    }

  }

  getMonthStart = (analysisNumber: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

        if (MessageService.MSG.SUCCESS === res.status) {
          console.log("res getMonthStart : ", res);
          this.objMonth = res.data;

          // this.formVo = this.formVo = this.setForm();
          // resolve(this.formVo);
        } else {
          // this.formVo = this.setForm();
          // reject(this.formVo)
          console.log("error getMonthStart  ");
          this.messageBar.errorModal(res.message);
        }

      })
    });
  }

  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sector = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.area = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }

  export() {
    console.log("export...")
    let url = "ta/report/export-worksheet-selected";
    let param = '';
    param += "?planNumber=" + this.planNumber;
    this.ajax.download(url + param);

  }
  // ==> app function end

  // ==> call backend start
  onDelete(id: string) {
    console.log("onDelete id : ", id);
    this.ajax.doDelete(`ta/tax-operator/delete-plan-worksheet-dtl/${id}`).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.table.ajax.reload();
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }
  getBudgetYear(): Observable<any> {
    return new Observable((resObs => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          resObs.next(res.data);
        } else {
          this.messageBar.errorModal(res.message);
        }

      });
    }));
  }
  getPlanNumber(resbudgetYear: any): Observable<any> {
    return new Observable((resObs => {
      this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": resbudgetYear }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          resObs.next(res.data);
        } else {
          this.messageBar.errorModal(res.message);
        }

      });
    }));
  }

  checkSubmitDatePlanWorksheetSend(planNumber): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("ta/tax-operator/check-submit-date-plan-worksheet-send", { planNumber: planNumber }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.disabledButton = res.data;
          if (this.disabledButton == true) {
            this.disabledButton1 = this.disabledButton
            console.log("this.disabledButton1 : ", this.disabledButton1);
          }

          obs.next(res.data)
          console.log("checkSubmitDatePlanWorksheetSend :", res.data)
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error checkSubmitDatePlanWorksheetSend !");
        }
      });
    });
  }
  
// check digit officecode
  chekcIsChlid(){
    var offCode:string = this.userDetail.getUserDetails().officeCode;
    // offCode.substring(2,6);
    if (offCode){
      console.log("substring ",Number(offCode.substring(2,6)));
      var substr:Number = Number(offCode.substring(2,6));
      if (substr> 0 && !this.userDetail.getUserDetails().isCentral){
        this.isChild = true ;
      }else{
        this.isChild = false ;
        if (this.disabledButton1){
          this.isChild = true;
        }
      }
    }
    // this.isChild = false;

    if (this.userDetail.getUserDetails().isCentral){
      this.buttonName = "ส่งต่อภาค"
    }else{
      this.buttonName = "ส่งต่อพื้นที่"
    }
    

  }

  // ==> call backend end

}
