import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  template: `
    <input type="text" [(ngModel)]="name"/>
  `,
})
export class AppComponent  { 
  name = 'Angular'; 
}
