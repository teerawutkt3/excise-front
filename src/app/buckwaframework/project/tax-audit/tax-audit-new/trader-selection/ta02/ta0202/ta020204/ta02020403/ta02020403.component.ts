import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';

@Component({
  selector: 'app-ta02020403',
  templateUrl: './ta02020403.component.html',
  styleUrls: ['./ta02020403.component.css']
})
export class Ta02020403Component implements OnInit {

  action: any;
  actionD: any;
  actiontotal: boolean[] = [false,false,false,false,false];
  actionB: any;
  newRegId: string = "";
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
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


  hedenActiontotal(n){
    if(n == 1){
      this.actiontotal = [true,false,false,false,false];
    }else if(n == 2){
      this.actiontotal =[false,true,false,false,false];
    }else if(n == 3){
      this.actiontotal =[true,true,false,false,false];
    }else if(n == 4){
      this.actiontotal =[false,true,true,false,false];
    }else if(n == 5){
      this.actiontotal =[false,true,true,true,false];
    }else if(n == 6){
      this.actiontotal =[false,true,true,false,true];
    }
   
  }

}
