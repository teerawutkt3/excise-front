import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
declare var $: any
@Component({
  selector: 'app-int0609',
  templateUrl: './int0609.component.html',
  styleUrls: ['./int0609.component.css']
})
export class Int0609Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบรายได้ ", route: "#" },
    { label: "ตรวจสอบการนำฝาก/ส่งเงินรายได้", route: "#" },
  ];
  travelTo1List: any;
  travelTo2List: any;
  travelTo3List: any;

  travelTo1AddList: any;
  travelTo2AddList: any;
  travelTo3AddList: any;

  travelToDescription: any;

  constructor(
    private ajax: AjaxService,
  ) { }

  ngAfterViewInit(): void {
    this.calender();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown").css("width", "100%");
  }
  ngOnInit() {

    this.travelTo1Dropdown();
    this.travelTo1AddDropdown();

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


  travelTo1Dropdown = () => {

    const URL = "combobox/controller/getDropByTypeAndParentId";
  }


  travelTo2Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
    }
  }
  
  travelTo3Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
    }
  }



  travelTo1AddDropdown = () => {
    const URL = "combobox/controller/getDropByTypeAndParentId";
  }
  travelTo2AddDropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
    }
  }
  travelTo3AddDropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
    }
  }
  setTravelTo = e => {
    $('#travelTo').val(e.target.value);
    $('#travelToId').val(e.target.value);

  }

  setTravelToAdd = e => {
    $('#travelToAdd').val(e.target.value);
    $('#travelToIdAdd').val(e.target.value);

    if ($("#travelTo3Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text() + " " + $('#travelTo2Add option:selected').text() + " " + $('#travelTo3Add option:selected').text();
    } else if ($("#travelTo2Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text() + " " + $('#travelTo2Add option:selected').text();
    } else if ($("#travelTo1Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text();
    }
    console.log("TravelToDescription : ", this.travelToDescription);
  }


}
