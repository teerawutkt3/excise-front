import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { BreadCrumb } from 'models/breadcrumb.model';

declare var $: any;
@Component({
  selector: 'app-int0610',
  templateUrl: './int0610.component.html',
  styleUrls: ['./int0610.component.css']
})
export class Int0610Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบรายได้ ", route: "#" },
    { label: "ตรวจสอบงบสรุปยอดเงินค่าภาษีกับงบทดลอง", route: "#" },
  ];

  compareList: any[] = [];
  isLoading: boolean = false;
  travelTo1List: any;
  travelTo2List: any;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private messageBar: MessageBarService) { }

  ngOnInit() {
    // $(".ui.dropdown").dropdown();
    // $(".ui.dropdown.ai").css("width", "100%");

    this.travelTo1Dropdown();

  }

  ngAfterViewInit() {
    //$("#selectZone").dropdown();
    //$("#selectArea").dropdown();
  }

  travelTo1Dropdown = () => {

    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "SECTOR_VALUE" }, res => {
      this.travelTo1List = res.json();
    });
  }

  travelTo2Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo2List = res.json();
      });
    }
  }

  public compaireData() {
    let url = "ia/int014/compair"
    let prams = {

    };

    this.isLoading = true;

    this.ajax.post(url, prams, (res) => {
      this.isLoading = false;

      let json = res.json();
      console.log(json);
      if (json.status == "0") {
        console.log("ทำรายการสำเร็จ");
        // this.router.navigate(['/int01/4/3',{ uploadid : '1' }]);
        this.compareList = json.data.datas;
      } else {
        this.messageBar.alert("ไม่สามารถทำรายการได้.");
      }
    },
      (error) => {
        // console.error("Error");
        this.messageBar.error("ไม่สามารถทำรายการได้");
        this.isLoading = false;
      });
  }

}
