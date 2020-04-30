import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import * as TAACTION from '../../../../ta03/ta0301/ta0301.action';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-ta02020302',
  templateUrl: './ta02020302.component.html',
  styleUrls: ['./ta02020302.component.css']
})
export class Ta02020302Component implements OnInit {

  action: any;
  newRegId: string = "";
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
  link(link: any) {
    throw new Error("Method not implemented.");
  }
  hedenAction(v) {
    this.action = v;
  }

  // ==================== Go to FormTS
  gotoTS10() {
    console.log('gotoTS10');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_10"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0110"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0110'])
    });
  }
  gotoTS11() {
    console.log('gotoTS11');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_11"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0111"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0111'])
    });
  }
  gotoTS13() {
    console.log('gotoTS13');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_13"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0113"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0113'])
    })
  }

  dispatchData(formTS, pathTS): Observable<any> {
    return new Observable(obs => {
      this.store.dispatch(new TAACTION.AddPathTsSelect(formTS))
      this.store.dispatch(new TAACTION.AddFormTsNumber(pathTS))
      obs.next("Dispatch...")
    })

  }
  // ==================== Go to FormTS end
}
