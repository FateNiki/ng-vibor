import { Component, Input, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';

import { DataSourceConnector } from '../../helpers/connector';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter } from 'rxjs/operators';

declare type T = string;

@Component({
    selector: 'vibor-options-viewer',
    templateUrl: './options-viewer.component.html',
    styleUrls: ['./options-viewer.component.scss']
})
export class OptionsViewerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public dataSource: DataSourceConnector<any, any>;
    @Input() public itemSize = 50;
    @Input() public optionsViewerSize = 300;

    @ViewChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;

    public selectedItem: T;
    public selectedIndex: number;
    public countElementOnViewer: number;
    public firstElementSub: Subscription;

    ngOnInit() {
        this.firstElementSub = this.dataSource.selectedElement.pipe(
            filter(value => !!value)
        ).subscribe(value => {
            this.selectedItem = value.element;
            this.focusSelectedOption(value.index);
        });
    }

    ngOnDestroy() {
        if (this.firstElementSub) this.firstElementSub.unsubscribe();
    }

    ngOnChanges() {
        this.countElementOnViewer = Math.ceil(this.optionsViewerSize / this.itemSize);
    }

    private focusSelectedOption(currentIndex: number): void {
        this.scrollViewport.scrollToIndex(currentIndex);
    }
}



