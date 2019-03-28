import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';

import { DataSourceConnector } from '../../helpers/connector';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter } from 'rxjs/operators';
import { NgViborService } from '../../services/ng-vibor.service';
import { DataSourceToken, ItemHeightToken, OptionsViewerSizeToken } from '../../injection.token';

declare type T = string;

@Component({
    selector: 'vibor-options-viewer',
    templateUrl: './options-viewer.component.html',
    styleUrls: ['./options-viewer.component.scss']
})
export class OptionsViewerComponent<SModel> implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;

    public selectedItem: T;
    public subs = new Subscription();

    constructor(
        private vs: NgViborService<SModel>,
        @Inject(DataSourceToken) public dataSource: DataSourceConnector<any, SModel>,
        @Inject(ItemHeightToken) public itemSize: number,
        @Inject(OptionsViewerSizeToken) public optionsViewerSize: number
    ) { }

    ngOnInit() {
        this.subs.add(this.ChangeSelectionSubscription);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.dataSource.disconnect();
    }

    /** Подписчик на изменение выделенного элемента */
    private get ChangeSelectionSubscription(): Subscription {
        return this.dataSource.selectedElement.pipe(
            filter(value => !!value)
        ).subscribe(value => {
            this.selectedItem = value.element;
            this.focusSelectedOption(value.index);
        });
    }

    /** Отображение выделенного элемента в scrollViewport  */
    private focusSelectedOption(currentIndex: number): void {
        this.scrollViewport.scrollToIndex(currentIndex);
    }

    /** Выбор опции по клику */
    public ChooseOptions(element: SModel) {
        this.vs.chooseOptions.next(element);
    }
}



