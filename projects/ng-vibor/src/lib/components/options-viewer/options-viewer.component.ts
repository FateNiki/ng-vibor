import { Component, Input, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';

import { DataSourceConnector } from '../../helpers/connector';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter } from 'rxjs/operators';
import { NgViborService } from '../../services/ng-vibor.service';

declare type T = string;

@Component({
    selector: 'vibor-options-viewer',
    templateUrl: './options-viewer.component.html',
    styleUrls: ['./options-viewer.component.scss']
})
export class OptionsViewerComponent<SModel> implements OnInit, OnChanges, OnDestroy {
    @Input() public dataSource: DataSourceConnector<any, any>;
    @Input() public itemSize = 50;
    @Input() public optionsViewerSize = 300;

    @ViewChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;

    public selectedItem: T;
    public countElementOnViewer: number;
    public subs = new Subscription();

    constructor(private vs: NgViborService<SModel>) { }

    ngOnInit() {
        this.subs.add(this.dataSource.selectedElement.pipe(
            filter(value => !!value)
        ).subscribe(value => {
            this.selectedItem = value.element;
            this.focusSelectedOption(value.index);
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.dataSource.disconnect();
    }

    ngOnChanges() {
        this.countElementOnViewer = Math.ceil(this.optionsViewerSize / this.itemSize);
    }

    private focusSelectedOption(currentIndex: number): void {
        this.scrollViewport.scrollToIndex(currentIndex);
    }

    public ChooseOptions(element: SModel) {
        this.vs.chooseOptions.next(element);
    }
}



