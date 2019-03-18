import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { NgViborService } from '../../services/ng-vibor.service';
import { DataSourceConnector } from '../../helpers/connector';
import { Subscription } from 'rxjs';
import { scrollActiveOption } from '../../helpers/functions';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
    selector: 'vibor-options-viewer',
    templateUrl: './options-viewer.component.html',
    styleUrls: ['./options-viewer.component.scss']
})
export class OptionsViewerComponent implements OnInit, OnDestroy {
    @Input() public dataSource: DataSourceConnector;
    @ViewChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;

    public selectedItem: any;
    public selectedIndex: any;
    public firstElementSub: Subscription;

    constructor(private vs: NgViborService) {
        this.vs.inputKeyEvent.subscribe(event => {
            switch (event.key) {
                case 'ArrowUp':
                    this.dataSource.NextElement(-1);
                    break;
                case 'ArrowDown':
                    this.dataSource.NextElement(1);
                    break;
            }
        });
    }

    ngOnInit() {
        this.firstElementSub = this.dataSource.selectedElement.subscribe(value => {
            this.selectedItem = value;
            this.focusSelectedOption();
        });
    }

    ngOnDestroy() {
        if (this.firstElementSub) this.firstElementSub.unsubscribe();
    }

    private focusSelectedOption(): void {
        const targetLi = this.scrollViewport.elementRef.nativeElement.getElementsByClassName('selected')[0] as HTMLElement;
        if (!targetLi) {
            this.scrollViewport.scrollToIndex(this.selectedIndex + 1);
        }
    }
}



