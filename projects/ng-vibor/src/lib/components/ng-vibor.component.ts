import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vibor-select',
  template: `
      <vibor-query-input></vibor-query-input>
      <vibor-options-viewer></vibor-options-viewer>
    `,
  styles: []
})
export class NgViborComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
