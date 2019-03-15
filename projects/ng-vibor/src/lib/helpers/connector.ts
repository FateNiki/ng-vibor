import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { IsNumber } from './functions';

export interface IConnectorData<T> {
    data: Array<T>;
    end: boolean;
}

export abstract class Connector<T = any> {
    private query = new BehaviorSubject<string>('');
    private page = new BehaviorSubject<number>(1);

    private value = new BehaviorSubject<IConnectorData<T>>(undefined);
    public value$ = this.value.asObservable();

    constructor(public limit = 20) {
        this.query.subscribe(() => {
            this.page.next(1);
        });

        this.page.pipe(
            filter(() => this.value.observers.length > 0),
            switchMap(page => {
                if (!IsNumber(page) || page <= 0) throwError('Invalid page');

                return this.Get();
            })
        ).subscribe(answer => {
            this.value.next(answer);
        });
    }

    // При открытии
    public ForceUpdate() {
        this.Get().subscribe(answer => {
            this.value.next(answer);
        });
    }

    protected abstract Get(): Observable<IConnectorData<T>>;


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
