import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';

@Component({
  selector: 'app-ta02020501',
  templateUrl: './ta02020501.component.html',
  styleUrls: ['./ta02020501.component.css']
})
export class Ta02020501Component implements OnInit {
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
}
