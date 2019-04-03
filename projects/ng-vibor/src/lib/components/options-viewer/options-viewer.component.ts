import { Component, OnInit, OnDestroy, ViewChild, Inject, HostBinding, TemplateRef, Optional, ViewEncapsulation } from '@angular/core';

import { DataSourceConnector } from '../../helpers/datasource';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { NgViborService } from '../../services/ng-vibor.service';
import { DataSourceToken, ItemHeightToken, OptionsViewerSizeToken, OptionsTemplateToken } from '../../injection.token';

declare type T = string;

@Component({
    selector: 'vibor-options-viewer',
    templateUrl: './options-viewer.component.html',
    styleUrls: ['./options-viewer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OptionsViewerComponent<SModel> implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;
    @HostBinding('style.width') width = '100%';

    public selectedItem: T;
    public query: string;
    public subs = new Subscription();

    constructor(
        private vs: NgViborService<SModel>,
        @Inject(DataSourceToken) public dataSource: DataSourceConnector<any, SModel>,
        @Inject(ItemHeightToken) public itemSize: number,
        @Inject(OptionsViewerSizeToken) public optionsViewerSize: number,
        @Optional() @Inject(OptionsTemplateToken) public optionTemplate: TemplateRef<any>
    ) { }

    ngOnInit() {
        this.subs.add(this.ChangeSelectionSubscription);
        this.subs.add(this.ChangeQuerySubscription);
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

    /** Подписчик на строки поиска */
    private get ChangeQuerySubscription(): Subscription {
        return this.vs.query$.pipe(
            distinctUntilChanged()
        ).subscribe(newQuery => {
            this.query = newQuery;
        });
    }

    /** Отображение выделенного элемента в scrollViewport  */
    private focusSelectedOption(currentIndex: number): void {
        this.scrollViewport.scrollToIndex(currentIndex);
    }

    /** Выбор опции по клику */
    public ChooseOptions(element: SModel) {
        this.vs.ChooseOption(element);
    }
}



