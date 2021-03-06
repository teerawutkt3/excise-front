import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "../../../../common/helper/datepicker";
import { AuthService } from "services/auth.service";

declare var $: any;
@Component({
  selector: "app-report-out",
  templateUrl: "./report-out.component.html",
  styleUrls: ["./report-out.component.css"]
})
export class ReportOutComponent implements OnInit {
  target: any;
  year: any;
  toggled: boolean;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    
    //this.authService.reRenderVersionProgram('REP-04030');

    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    // calendar
    $("#year").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("year")
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.year = e.target.year.value;
    e.target.year.value = "";
    this.toggled = true;
    this.target = e.target.target.value;
    e.target.target.value = "";
  }

  onCancel() {
    this.toggled = false;
  }
}
