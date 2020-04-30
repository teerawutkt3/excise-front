import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as TAACTION from '../../../../../trader-selection/ta03/ta0301/ta0301.action';
@Component({
  selector: 'app-ta02020402',
  templateUrl: './ta02020402.component.html',
  styleUrls: ['./ta02020402.component.css']
})
export class Ta02020402Component implements OnInit {
  action: any;
  actionD: any;
  actiontotal: boolean[] = [false, false, false];
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


  hedenActiontotal(n) {
    if (n == 1) {
      this.actiontotal = [true, false, false];
    } else if (n == 2) {
      this.actiontotal = [false, true, false];
    } else if (n == 0) {
      this.actiontotal = [true, true, false];
    } else if (n == 3) {
      this.actiontotal = [false, true, true];
    }

  }
  gotoTS05() {
    console.log('gotoTS05');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_05"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0105"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0105'])
    })
  }
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
    })
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
    })
  }
  gotoTS14() {
    console.log('gotoTS14');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_14"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0114"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0114'])
    })
  }
  gotoTS141() {
    console.log('gotoTS141');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_14_1"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts01141"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0114/1'])
    })
  }
  gotoTS142() {
    console.log('gotoTS142');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_14_2"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts01142"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0114/2'])
    })
  }
  gotoTS171() {
    console.log('gotoTS171');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_17_1"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts01171"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts01171'])
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
