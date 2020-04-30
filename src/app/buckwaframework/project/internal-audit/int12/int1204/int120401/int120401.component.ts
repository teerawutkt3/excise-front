import { Component, OnInit } from '@angular/core';
import { Int120401Service } from './int120401.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;

@Component({
    selector: 'app-int120401',
    templateUrl: './int120401.component.html',
    styleUrls: ['./int120401.component.css'],
    providers: [Int120401Service]
})
export class Int120401Component implements OnInit {
    breadcrumb: BreadCrumb[] = [
        { label: "ตรวจสอบภายใน", route: "#" },
        { label: "บันทึกข้อมูล", route: "#" },
        { label: "ข้อมูลค่าใช้จ่าย", route: "#" },
    ];
    yearList: any;
    model: FormSearch;
    data: Data;
    chartOfAccList: any
    formSave: FormGroup
    constructor(
        private Int120401Service: Int120401Service,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private iaService: IaService,
        private fb: FormBuilder,
    ) {
        this.model = new FormSearch();
        this.data = new Data();
        this.formSave = this.fb.group({
            accountId: [''],
            accountName: [''],
            year: []
        })

    }

    ngOnInit() {
        this.authService.reRenderVersionProgram('INT-120401');
        $("#year").dropdown();
        this.iaService.setData(null);
        this.Int120401Service.setSearchFlag(this.route.snapshot.queryParams["searchFlag"] || "" || undefined);

        // this.year();
        this.getData()
        this.getChartOfAcc()
    }

    ngAfterViewInit(): void {
        $(".ui.dropdown").dropdown()
        $(".ui.dropdown.ia").css("width", "100%")
        this.dataTable()
        this.calendar()
    }

    

    calendar() {
        $("#budgetYear").calendar({
            type: "year",
            initialDate: new Date(),
            text: TextDateTH,
            formatter: formatter("ป"),
            onChange: (date, text) => {
                this.formSave.patchValue({
                    year: text
                })
            }
        });
    }

    getData(accountId?, year?) {
        this.Int120401Service.getData({
            accountId: accountId,
            year: year
        }).then(then => {
            console.log("then", then);
        });
    }

    changeChartOfAcc(e, flag: string) {
        let data = []
        if ('1' == flag) {
            data = this.chartOfAccList.filter(obj => obj.coaCode == e.target.value)
        } else if ('2' == flag) {
            data = this.chartOfAccList.filter(obj => obj.coaName == e.target.value)
        }
        console.log(data);
        if (data.length != 0) {
            this.formSave.patchValue({
                accountId: data[0].coaCode,
                accountName: data[0].coaName
            })
            $('#coaCode').dropdown('set selected', data[0].coaCode)
            $('#coaName').dropdown('set selected', data[0].coaName)
        }
        console.log(this.formSave.value);

    }

    getChartOfAcc() {
        this.Int120401Service.getChartOfAcc().then((res: any) => {
            this.chartOfAccList = res.data
            console.log("res =>", this.chartOfAccList);
        });
    }

    search() {
        let model = new FormSearch
        model.accountId = this.formSave.value.accountId
        model.accountName = this.formSave.value.accountName
        model.year = this.formSave.value.year
        model.searchFlag = "TRUE";
        this.Int120401Service.search(model);
    }
    clear() {
        this.formSave.reset()
        $('#coaCode').dropdown('clear')
        $('#coaName').dropdown('clear')
        $('#budgetYear').calendar('clear')
        this.search()
    }

    dataTable = () => {
        this.Int120401Service.dataTable();
    }

    year = () => {
        this.Int120401Service.year(this.callBackYear);
    }

    callBackYear = (result) => {
        this.yearList = result;
    }

}

class FormSearch {
    accountId: string = "";
    accountName: string = "";
    searchFlag: string = "";
    year: string = ""
}

class Data {
    id: string = "";
    accountId: string = "";
    accountName: string = "";
    serviceReceive: string = "";
    serviceWithdraw: string = "";
    serviceBalance: string = "";
    suppressReceive: string = "";
    suppressWithdraw: string = "";
    suppressBalance: string = "";
    budgetReceive: string = "";
    budgetWithdraw: string = "";
    budgetBalance: string = "";
    sumReceive: string = "";
    sumWithdraw: string = "";
    sumBalance: string = "";
    moneyBudget: string = "";
    moneyOut: string = "";
    averageCost: string = "";
    averageGive: string = "";
    averageFrom: string = "";
    averateComeCost: string = "";
    createdBy: string = "";
    updatedBy: string = "";
    createdDate: string = "";
    updatedDate: string = "";
    note: string = "";
    editStatus: string = "";
}
