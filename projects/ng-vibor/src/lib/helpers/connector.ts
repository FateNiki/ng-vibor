import { BehaviorSubject, Observable, throwError, Subscription, Subject } from 'rxjs';
import { switchMap, filter, skip } from 'rxjs/operators';
import { IsNumber } from './functions';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

export interface IConnectorData<T> {
    data: Array<T>;
    end: boolean;
}

export abstract class Connector<SModel = any, FModel = any> {
    private query = new BehaviorSubject<string>('');
    private page = new BehaviorSubject<number>(1);

    private value = new BehaviorSubject<IConnectorData<SModel>>(undefined);
    public value$ = this.value.asObservable();

    constructor(public limit = 20) {
        this.query.subscribe(() => {
            this.page.next(1);
        });

        this.page.pipe(
            filter(() => this.value.observers.length > 0),
            switchMap(page => {
                if (!IsNumber(page) || page <= 0) throwError('Invalid page');

                return this.GetList();
            })
        ).subscribe(answer => {
            this.value.next(answer);
        });
    }

    // При открытии
    public ForceUpdate() {
        this.GetList().subscribe(answer => {
            this.value.next(answer);
        });
    }

    protected abstract GetList(): Observable<IConnectorData<SModel>>;

    protected Comparator(a: SModel, b: SModel): boolean {
        return a === b;
    }

    protected abstract Find(a: FModel): SModel;
    protected abstract Find(a: Array<FModel>): Array<SModel>;

    // From Vibor
    public set Page(value: number) {
        this.page.next(value);
    }

    public set Query(value: string) {
        this.query.next(value);
    }

    // Protected
    protected get Offset(): number {
        const page = this.page.value;
        return (page - 1) * this.limit;
    }
    protected get Limit(): number {
        const page = this.page.value;
        return page * this.limit;
    }
}



declare type IStorageValue = string;

export class DataSourceConnector extends DataSource<IStorageValue | undefined> {
    // Const
    private readonly length = 100000;
    private readonly pageSize = 100;

    // Cache
    private cachedData = Array.from<IStorageValue>({ length: this.length });
    private fetchedPages = new Set<number>();

    // Data and Subscriber
    public selectedElement = new BehaviorSubject<{element: IStorageValue, index: number} | undefined>(undefined);
    private dataStream = new BehaviorSubject<(IStorageValue | undefined)[]>(this.cachedData);
    private subscription = new Subscription();

    connect(collectionViewer: CollectionViewer): Observable<(IStorageValue | undefined)[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
            for (let i = startPage; i <= endPage; i++) {
                this.fetchPage(i);
            }
        }));

        const firstSub = this.dataStream.pipe(
            skip(1)
        ).subscribe(values => {
            this.selectedElement.next({element: values[0], index: 0});
            firstSub.unsubscribe();
        });

        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    private fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);

        // Use `setTimeout` to simulate fetching data from server.
        setTimeout(() => {
            this.cachedData.splice(page * this.pageSize, this.pageSize,
                ...Array.from({ length: this.pageSize })
                    .map((_, i) => `Options #${page * this.pageSize + i}`));
            this.dataStream.next(this.cachedData);
        }, Math.random() * 1000 + 200);
    }

    // Selected
    public NextElement(delta: 1 | -1): void {
        const element = this.selectedElement.value && this.selectedElement.value.element;
        const index = this.cachedData.indexOf(element) + delta;
        if (index < 0 || index >= this.cachedData.length) {
            return;
        } else {
            this.selectedElement.next({element: this.cachedData[index], index});
        }

    }
}
