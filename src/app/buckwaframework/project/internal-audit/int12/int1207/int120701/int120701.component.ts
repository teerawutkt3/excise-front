import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { AuthService } from "services/auth.service";
import { Router } from "@angular/router";
import { Int120701Service, Lov } from './int120701.service';
import { BreadCrumb } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;

@Component({
  selector: 'app-int120701',
  templateUrl: './int120701.component.html',
  styleUrls: ['./int120701.component.css'],
  providers: [Int120701Service]
})
export class Int120701Component implements OnInit, AfterViewInit {
  breadcrumb: BreadCrumb[];
  form: FormGroup = new FormGroup({});

  bills: any;



  constructor(
    private router: Router,
    private service: Int120701Service,
    private authService: AuthService
  ) {

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบเบิกจ่าย", route: "#" },
      { label: "บันทึกคำขอเบิก", route: "#" }
    ];
  }

  ngOnInit() {

   
 

  }

  ngAfterViewInit() {
    $(`.ui.fluid.dropdown`)
      .dropdown({
        clearable: true
      })
      .css("width", "100%");
      this.shearch11(1);
      this.calender();
      $('.dropdown').dropdown('set selected', '1');
  }



  calender() {
    $("#calendar1").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter("date"),
      onChange: (date, text, mode) => {
        // this.formSearch.get('qtnYear').setValue(text);
      }
    });
    $("#calendar2").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter("date"),
      onChange: (date, text, mode) => {
        // this.formSearch.get('qtnYear').setValue(text);
      }
    });
  }

  createbill(b) {
    if(b==1){
     this.router.navigate(["/int12/07/01/01"]);
    }
    if(b==2){
      this.router.navigate(["/int12/07/01/02"]);
     }
  }
  table1 : boolean = false;
  table2 : boolean = false;
  shearch11(a) {
    if(a==1){
      this.table1 = true;
      this.table2 = false;
      
     
    }
    if(a==2){
      this.table1 = false;
      this.table2 = true;
      
    }
   

  }

}

