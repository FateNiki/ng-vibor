import { BehaviorSubject, Observable, Subscription, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { NgViborService } from '../services/ng-vibor.service';

export interface IConnectorData<T> {
    data: Array<T>;
    length: number;
}

export abstract class Connector<SModel = any, FModel = any> {
    constructor(public limit = 20) { }

    /** async method for load data by pages
     * In this method can be write cache module
     */
    public abstract GetList(query: string, page: number): Observable<IConnectorData<SModel>>;

    /**
     * Метод сравнения объектов в списке
     * @param a Объект для сравнения 1
     * @param b Объект для сравнения 2
     */
    public Comparator(a: SModel, b: SModel): boolean {
        return a === b;
    }

    /** Метод преобразования
     * Приведение объектов для хранения в форме
     */
    public Transform(a: SModel): FModel {
        return a as any;
    }

    /** Метод обратного преобразования
     * Поиск при преведении из значений формы в значения Storage
     * В коннекторе описывается метод и логика поиска.
     * Например, искать значения в загруженных, допускать ли значения - отсутствующие в списке или нет
     */
    public abstract TransformBack(a: FModel): SModel;
    public abstract TransformBack(a: Array<FModel>): Array<SModel>;


    // Protected
    protected Offset(page: number): number {
        return page * this.limit;
    }
    protected Limit(page: number): number {
        return (page + 1) * this.limit;
    }
}


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

            this.vs.query.pipe(tap(newQuery => {
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
