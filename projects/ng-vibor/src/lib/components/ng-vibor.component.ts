import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vibor-select',
  template: `
    <p>
      ng-vibor works!
      <vibor-options-viewer></vibor-options-viewer>
    </p>
  `,
  styles: []
})
export class NgViborComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
