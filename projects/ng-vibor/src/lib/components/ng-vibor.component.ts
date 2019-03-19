import { Component, OnDestroy } from '@angular/core';

import { merge, Subscription } from 'rxjs';

import { NgViborService } from '../services/ng-vibor.service';

import { DataSourceConnector } from '../helpers/connector';
import { ArrayConnector } from '../helpers/array.connector';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'vibor-select',
    template: `
      <vibor-query-input></vibor-query-input>
      <vibor-options-viewer *ngIf="showOptions" [dataSource]="dataSource"></vibor-options-viewer>
    `
})
export class NgViborComponent implements OnDestroy {
    private arrayConnector = new ArrayConnector(Array.from({length: 500}).map(Math.random), 50);
    public dataSource = new DataSourceConnector(this.arrayConnector, this.vs);

    public showOptions: boolean;
    private showOptionsSub: Subscription;

    constructor(private vs: NgViborService) {
        this.showOptionsSub = merge(
            this.vs.hideOptions.pipe(
                tap(() => this.showOptions = false)
            ),
            this.vs.showOptions.pipe(
                tap(() => this.showOptions = true)
            )
        ).subscribe();
    }

    ngOnDestroy() {
        if (this.showOptionsSub) this.showOptionsSub.unsubscribe();
    }
}
