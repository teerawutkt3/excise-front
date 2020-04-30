import { Component, OnInit } from '@angular/core';
import { Int12040101Service } from './int12040101.service';
import { IaService } from 'services/ia.service';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { AuthService } from 'services/auth.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';

declare let $: any
@Component({
  selector: 'app-int12040101',
  templateUrl: './int12040101.component.html',
  styleUrls: ['./int12040101.component.css'],
  providers: [Int12040101Service]
})
export class Int12040101Component implements OnInit {
  submitted: boolean = false
  breadcrumb: BreadCrumb[]
  loading: boolean = false
  chartOfAccList: any
  formSave: FormGroup
  id: string
  constructor(
    private Int12040101Service: Int12040101Service,
    private iaService: IaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageBarService,
    private ajax: AjaxService,
    private fb: FormBuilder,
  ) {
    // this.breadcrumb = [
    //   { label: "ตรวจสอบภายใน", route: "#" },
    //   { label: "บันทึกข้อมูล", route: "#" },
    //   { label: "ค่าใช้จ่าย", route: "#" },
    //   { label: "ข้อมูลค่าใช้จ่าย", route: "#" },
    //   { label: "เพิ่มข้อมูลค่าใช้จ่าย", route: "#" },
    // ];
    this.formSave = this.fb.group({
      id: [null],
      accountId: ['', Validators.required],
      accountName: ['', Validators.required],

      serviceReceive: [0, Validators.required],
      serviceWithdraw: [0, Validators.required],
      serviceBalance: [0, Validators.required],
      suppressReceive: [0, Validators.required],
      suppressWithdraw: [0, Validators.required],
      suppressBalance: [0, Validators.required],
      budgetReceive: [0, Validators.required],
      budgetWithdraw: [0, Validators.required],
      budgetBalance: [0, Validators.required],
      sumReceive: [0, Validators.required],
      sumWithdraw: [0, Validators.required],
      sumBalance: [0, Validators.required],
      moneyBudget: [0, Validators.required],
      moneyOut: [0, Validators.required],
      averageCost: [0],
      averageGive: [],
      averageFrom: [0],
      averageComeCost: [],
      note: [],

      officeCode: [, Validators.required],
      officeDesc: [, Validators.required],


      averageCostOut: [0],
      averageGiveOut: [],
      averageFromOut: [0],
      averageComeCostOut: [],
    })
  }

  ngOnInit() {
    let status: string = 'เพิ่มข้อมูลค่าใช้จ่าย'
    this.id = this.route.snapshot.queryParams["id"]
    if (this.id) {
      console.log("Have ID naja");
      this.findExpensesById(this.id)
      status = 'แก้ไขข้อมูลค่าใช้จ่าย'
    }

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบเบิกจ่าย", route: "#" },
      { label: "ตรวจสอบค่าใช้จ่าย", route: "#" },
      { label: status, route: "#" },
    ];

    this.getChartOfAcc()
  }
  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ia").css("width", "100%")
  }

  findExpensesById(id: string) {
    this.Int12040101Service.findExpensesById(id).then((res: any) => {
      console.log("Have Id ==>", res);
      this.formSave.patchValue({
        id: this.id,
        accountId: res.accountId,
        accountName: res.accountName,
        serviceReceive: res.serviceReceive,
        serviceWithdraw: res.serviceWithdraw,
        serviceBalance: res.serviceBalance,
        suppressReceive: res.suppressReceive,
        suppressWithdraw: res.suppressWithdraw,
        suppressBalance: res.suppressBalance,
        budgetReceive: res.budgetReceive,
        budgetWithdraw: res.budgetWithdraw,
        budgetBalance: res.budgetBalance,
        sumReceive: res.sumReceive,
        sumWithdraw: res.sumWithdraw,
        sumBalance: res.sumBalance,
        moneyBudget: res.moneyBudget,
        moneyOut: res.moneyOut,
        averageCost: res.averageCost,
        averageGive: res.averageGive,
        averageFrom: res.averageFrom,
        averageComeCost: res.averageComeCost,
        note: res.note,

        averageCostOut: res.averageCostOut,
        averageGiveOut: res.averageGiveOut,
        averageFromOut: res.averageFromOut,
        averageComeCostOut: res.averageComeCostOut,
      })
    })
  }

  onSave() {
    this.submitted = true
    this.formSave.patchValue({
      officeCode: this.authService.getUserDetails().officeCode,
      officeDesc: this.authService.getUserDetails().departmentName
    })
    if (this.formSave.invalid) {
      console.log(this.formSave.value);
      this.message.errorModal("กรุณากรอกข้อมูลให้ครบ")
      return
    }
    this.message.comfirm(confirm => {
      if (confirm) {
        this.Int12040101Service.onSave(this.formSave.value).then((res: any) => {
          this.submitted = false
          this.goLocation()
        });
      }
    }, "ยืนยันการบันทึก")
  }

  goLocation() {
    this.router.navigate(["/int12/04/01"], {
      // queryParams: {
      //   inspectionWork: this.inspectionWork.value,
      //   budgetYear: this.budgetYear
      // }
    })
  }

  invalidSaveControl(control: string) {
    return this.formSave.get(control).invalid && (this.formSave.get(control).touched || this.submitted);
  }

  getChartOfAcc() {
    this.Int12040101Service.getChartOfAcc().then((res: any) => {
      this.chartOfAccList = res.data
      console.log("res =>", this.chartOfAccList);
    });
  }

  changeChartOfAcc(e, flag: string) {
    let data
    if ('1' == flag) {
      data = this.chartOfAccList.filter(obj => obj.coaCode == e.target.value)
    } else if ('2' == flag) {
      data = this.chartOfAccList.filter(obj => obj.coaName == e.target.value)
    }
    console.log(data);

    this.formSave.patchValue({
      accountId: data[0].coaCode,
      accountName: data[0].coaName
    })
    $('#coaCode').dropdown('set selected', data[0].coaCode)
    $('#coaName').dropdown('set selected', data[0].coaName)

    console.log(this.formSave.value);

  }

  changeReceive() {
    let sumReceiveto = this.formSave.value.serviceReceive + this.formSave.value.suppressReceive + this.formSave.value.budgetReceive;
    let sumReceivefomat = new DecimalFormatPipe().transform(sumReceiveto, "###,###.00")
    let sumWithdrawto = this.formSave.value.serviceWithdraw + this.formSave.value.suppressWithdraw + this.formSave.value.budgetWithdraw;
    let sumWithdrawfomat = new DecimalFormatPipe().transform(sumWithdrawto, "###,###.00")
    let serviceBalanceto = this.formSave.value.serviceReceive - this.formSave.value.serviceWithdraw;
    let serviceBalancefomat = new DecimalFormatPipe().transform(serviceBalanceto.toString(), "###,###.00")
    let suppressBalanceto = this.formSave.value.suppressReceive - this.formSave.value.suppressWithdraw;
    let suppressBalancefomat = new DecimalFormatPipe().transform(suppressBalanceto.toString(), "###,###.00")
    let budgetBalanceto = this.formSave.value.budgetReceive - this.formSave.value.budgetWithdraw;
    let budgetBalancefomat = new DecimalFormatPipe().transform(budgetBalanceto.toString(), "###,###.00")

    this.formSave.patchValue({
      sumReceive: sumReceivefomat,
      sumWithdraw: sumWithdrawfomat,
      serviceBalance: serviceBalancefomat,
      suppressBalance: suppressBalancefomat,
      budgetBalance: budgetBalancefomat,
    })

    // console.log("serviceBalance : ", serviceBalanceto)
    // console.log("serviceBalancetototo :", parseInt(this.formSave.value.serviceBalance));
    let sumBalanceto = serviceBalanceto + suppressBalanceto + budgetBalanceto
    let sumBalancefomat = new DecimalFormatPipe().transform(sumBalanceto.toString(), "###,###.00")
    this.formSave.patchValue({
      // moneyBudget: this.formSave.value.serviceBalance + this.formSave.value.suppressBalance,
      // moneyOut: this.formSave.value.budgetBalance,
      sumBalance: sumBalancefomat
    })
    console.log("averageCost : ",this.formSave.value.averageCost);
    console.log("averageFrom : ",this.formSave.value.averageFrom);
    console.log("averageCostOut : ",this.formSave.value.averageCostOut);
    console.log("averageFromOut : ",this.formSave.value.averageFromOut);
    console.log("mateee : ",Math.abs(serviceBalanceto));
    console.log("mateee2 : ",Math.abs(suppressBalanceto));
    
    let moneyBudgetsum1 = Math.abs(serviceBalanceto) + Math.abs(suppressBalanceto) 
    console.log("moneyBudgetsum1 : ", moneyBudgetsum1);
    let moneyBudgetsum2 = this.formSave.value.averageCost - this.formSave.value.averageFrom
    console.log("moneyBudgetsum2 : ", moneyBudgetsum2);
    let moneyBudgetsumAll = moneyBudgetsum1 - moneyBudgetsum2
    let moneyBudgetsumFomat = new DecimalFormatPipe().transform(moneyBudgetsumAll.toString(), "###,###.00")
    let moneyOutto = budgetBalanceto - this.formSave.value.averageCostOut + this.formSave.value.averageFromOut
    let moneyOutFomat = new DecimalFormatPipe().transform(moneyOutto, "###,###.00")
    console.log("moneyBudgetto : ", moneyBudgetsumAll);
    this.formSave.patchValue({
      moneyBudget: moneyBudgetsumFomat,
      moneyOut: moneyOutFomat
    })
  }
}