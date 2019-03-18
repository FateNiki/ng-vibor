import { Component } from '@angular/core';
import { DataSourceConnector } from '../helpers/connector';

@Component({
    selector: 'vibor-select',
    template: `
      <vibor-query-input></vibor-query-input>
      <vibor-options-viewer [dataSource]="dataSource"></vibor-options-viewer>
    `
})
export class NgViborComponent {
    public dataSource = new DataSourceConnector();

    constructor() { }
}
