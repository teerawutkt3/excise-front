import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as TAACTION from '../../../../../trader-selection/ta03/ta0301/ta0301.action';
@Component({
  selector: 'app-ta02020401',
  templateUrl: './ta02020401.component.html',
  styleUrls: ['./ta02020401.component.css']
})
export class Ta02020401Component implements OnInit {

  constructor(
    private store  : Store<any>,
    private router: Router
  ) { }

  goTo(e){

  }
  ngOnInit() {
  }
  gotoTS01() {
    console.log('gotoTS01');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_01"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0101"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0101'])
    })
  }
  gotoTS02() {
    console.log('gotoTS02');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_02"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0102"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0102'])
    })
  }
  gotoTS03() {
    console.log('gotoTS03');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_03"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0103"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate(['/tax-audit-new/ta03/01/ta-form-ts0103'])
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
