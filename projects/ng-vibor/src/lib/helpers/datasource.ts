import { BehaviorSubject, Observable, Subscription, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { NgViborService } from '../services/ng-vibor.service';
import { Connector } from './connector';

export class DataSourceConnector<SModel, FModel> extends DataSource<SModel | undefined> {
    // Const
    private pageSize: number;

    // Cache
    private cachedData: Array<SModel>;
    private fetchedPages = new Set<number>();
    private query: string;

    // Data and Subscriber
    public selectedElement = new BehaviorSubject<{element: SModel, index: number} | undefined>(undefined);
    private dataStream = new BehaviorSubject<(SModel | undefined)[]>([]);
    private loadingSubject = new BehaviorSubject<number[]>([]);
    public loading$ = this.loadingSubject.asObservable();
    private subscription: Subscription;

    constructor(
        private connector: Connector<SModel, FModel>,
        private vs: NgViborService<SModel>
    ) {
        super();
        this.pageSize = connector.limit;
    }

    /** Base method for connection to virtual scrolling */
    connect(collectionViewer: CollectionViewer): Observable<(SModel | undefined)[]> {
        this.subscription = merge(
            collectionViewer.viewChange.pipe(tap(range => {
                const startPage = this.getPageForIndex(range.start);
                const endPage = this.getPageForIndex(range.end - 1);
                for (let i = startPage; i <= endPage; i++) {
                    this.fetchPage(i);
                }
            })),

            this.vs.query$.pipe(tap(newQuery => {
                this.queryChange(newQuery);
            }))
        ).subscribe();

        if (this.cachedData && this.cachedData.length) {
            this.selectedElement.next({element: this.cachedData[0], index: 0});
        }

        this.fetchPage(0); // Из за проблем с инициализацией пустого списка

        return this.dataStream;
    }

    /** Disconnect */
    disconnect(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    /** Get needed page
     * @return page
     */
    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    /** Get page */
    private fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }

        this.fetchedPages.add(page);
        this.loadingSubject.next([...this.loadingSubject.value, page]);

        this.connector.GetList(this.query, page).subscribe(newValues => {
            // TODO: Нормальный мерж списков (Учитывать что cachedData = undefined)

            const needEmitFistElement = !this.cachedData;
            if (needEmitFistElement) {
                this.cachedData = Array.from({length: newValues.length});
            }

            this.cachedData.splice(page * this.pageSize, this.pageSize, ...newValues.data);

            if (needEmitFistElement) {
                this.selectedElement.next({element: this.cachedData[0], index: 0});
            }

            this.dataStream.next(this.cachedData);
            const pages = this.loadingSubject.value;
            pages.splice(pages.indexOf(page), 1);
            this.loadingSubject.next(pages);
        });
    }

    private queryChange(newQuery: string) {
        if (newQuery !== this.query) {
            this.query = newQuery;
            this.cachedData = undefined;
            this.fetchedPages.clear();
            this.fetchPage(0);
        }
    }

    // Selected
    public SelectElement(delta: 1 | -1): void {
        const element = this.selectedElement.value && this.selectedElement.value.element;
        const index = this.cachedData.indexOf(element) + delta;
        if (index < 0 || index >= this.cachedData.length) {
            return;
        } else {
            this.selectedElement.next({element: this.cachedData[index], index});
        }
    }
}
