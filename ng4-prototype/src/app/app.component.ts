import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'my-app',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-sm-6 col-md-6">

          <ul>
            <li *ngFor="let cht of cheatsheets">
              {{cht}}
            </li>
          </ul>

        </div>
        <div class="col-sm-6 col-md-6">

          <ul>
            <li *ngFor="let kp of kps">
              {{kp}}
            </li>
          </ul>

        </div>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit { 

  name = "Angular";
  cheatsheets: string[];
  kps: string[];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getCheatsheets().subscribe(data => {
      console.log(data);
      this.cheatsheets = data.split(',');
    });

    this.appService.getKnowledgePieces().subscribe(data => {
      console.log(data);
      this.kps = data.split(',');
    });
   
  }
  
}
