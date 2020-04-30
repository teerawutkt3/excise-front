import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import * as TA0301ACTION from '../../../../ta03/ta0301/ta0301.action';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-ta02020301',
  templateUrl: './ta02020301.component.html',
  styleUrls: ['./ta02020301.component.css']
})
export class Ta02020301Component implements OnInit {
  icon1 : any;
  icon2 : any;
  icon3 : any;
  newRegId: string = "";
  status1 : string = "รอดำเนินการ";
  status2 : string = "กำลังดำเนินการ";
  status3 : string = "สำเร็จ";
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private store: Store<any>,
  ) { }

  ngOnInit() {

    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
  }

  goTo(link: string) {
    console.log(this.newRegId);

    this.router.navigate([link], {
      queryParams: {
        newRegId: this.newRegId

      }
    });
  }
  selectIcon(){
    let btn = '';
    if(this.icon1 == 'A'){
      btn =' <div [attr.data-tooltip]="status3"> <i class="small circular inverted green check icon" style="font-size: 1em;" ></i></div>'
    }else if(this.icon2 == 'B'){
      btn =' <div [attr.data-tooltip]="status3"> <i class="small circular inverted green check icon" style="font-size: 1em;" ></i></div>'
    }else if(this.icon3 == 'C'){
      btn =' <div [attr.data-tooltip]="status3"> <i class="small circular inverted green check icon" style="font-size: 1em;" ></i></div>'
    }
    return btn;

  }
//==================== Go to formTs
  gotoTS07() {
    console.log('gotoTS07');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_07"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0107"
    }
    this.dispatchData(formTS, pathTS).subscribe(res=>{
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0107'])
    });
  }
  gotoTS08() {
    console.log('gotoTS08');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_08"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0108"
    }
    this.dispatchData(formTS, pathTS).subscribe(res=>{
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0108'])
    });
  }
  dispatchData(formTS, pathTS): Observable<any> {
    return new Observable(obs => {
      this.store.dispatch(new TA0301ACTION.AddPathTsSelect(formTS))
      this.store.dispatch(new TA0301ACTION.AddFormTsNumber(pathTS))
      obs.next("Dispatch...")
    })

  }
  //==================== Go to formTs end
}

