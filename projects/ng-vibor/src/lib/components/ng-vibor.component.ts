import { Component } from '@angular/core';
import { DataSourceConnector } from '../helpers/connector';
import { ArrayConnector } from '../helpers/array.connector';
import { NgViborService } from '../services/ng-vibor.service';

@Component({
    selector: 'vibor-select',
    template: `
      <vibor-query-input></vibor-query-input>
      <vibor-options-viewer [dataSource]="dataSource"></vibor-options-viewer>
    `
})
export class NgViborComponent {
    private arrayConnector = new ArrayConnector(Array.from({length: 500}).map(Math.random), 50);
    public dataSource = new DataSourceConnector(this.arrayConnector, this.vs);

    constructor(private vs: NgViborService) { }
}
