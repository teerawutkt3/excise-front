import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';

@Component({
  selector: 'app-ta020204',
  templateUrl: './ta020204.component.html',
  styleUrls: ['./ta020204.component.css']
})
export class Ta020204Component implements OnInit {
  colorStep : boolean[] =[true,false,false] ;
  newRegId: string = "";
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
  ) { }


  ngOnInit() {
  }

  urlActivate(urlMatch: string) {
    return this.router.url && this.router.url.substring(0,15) == urlMatch;
  }


  ngAfterViewInit(): void {
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
  }

  goTo(link: string,num :number) {
    this.colorStep =[false,false,false] ;
    this.colorStep[num]= true;
    this.router.navigate([link], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
  }
}
