import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TAACTION from '../../../../ta03/ta0301/ta0301.action';
@Component({
  selector: 'app-ta02020303',
  templateUrl: './ta02020303.component.html',
  styleUrls: ['./ta02020303.component.css']
})
export class Ta02020303Component implements OnInit {
  action: any;
  actionD: any;
  actionC: any;
  actionB: any;
  newRegId: string = "";
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private store:Store<any>
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
  hedenAction(v){
    this.action = v;
  }
  hedenActionD(v){
    this.actionD = v;
  }
  hedenActionC(v){
    this.actionC = v;
  }
  hedenActionB(v){
    this.actionB = v;
  }

  gotoTS17() {
    console.log('gotoTS17');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_17"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0117"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0117'])
    })
  }
  gotoTS18() {
    console.log('gotoTS18');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_18"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0118"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0118'])
    })
  }
  gotoTS19() {
    console.log('gotoTS19');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_19"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0119"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0119'])
    })
  }

  dispatchData(formTS, pathTS): Observable<any> {
    return new Observable(obs => {
      this.store.dispatch(new TAACTION.AddPathTsSelect(formTS))
      this.store.dispatch(new TAACTION.AddFormTsNumber(pathTS))
      obs.next("Dispatch...")
    })

  }
}

