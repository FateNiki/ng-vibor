import { Component, OnDestroy, Input, OnInit } from '@angular/core';

import { merge, Subscription } from 'rxjs';

import { NgViborService } from '../services/ng-vibor.service';

import { DataSourceConnector, Connector } from '../helpers/connector';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'vibor-test',
    template: `
      <vibor-query-input></vibor-query-input>
      <vibor-options-viewer *ngIf="showOptions" [dataSource]="dataSource"></vibor-options-viewer>
    `,
    providers: [NgViborService]
})
export class TestViborComponent<SModel = any, FModel = any> implements OnInit, OnDestroy {
    @Input() connector: Connector<SModel, FModel>;
    public dataSource: DataSourceConnector<SModel, FModel>;

    public showOptions: boolean;
    private showOptionsSub: Subscription;

    constructor(private vs: NgViborService<SModel>) {
        this.showOptionsSub = merge(
            this.vs.hideOptions.pipe(
                tap(() => this.showOptions = false)
            ),
            this.vs.showOptions.pipe(
                tap(() => this.showOptions = true)
            )
        ).subscribe();
    }

    ngOnInit() {
        this.dataSource = new DataSourceConnector<SModel, FModel>(this.connector, this.vs);
    }

    ngOnDestroy() {
        if (this.showOptionsSub) this.showOptionsSub.unsubscribe();
    }
}
