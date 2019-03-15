import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface IConnectorData<T> {
    data: Array<T>;
    end: boolean;
}

export abstract class Connector<T = any> {
    private query = new BehaviorSubject<string>('');
    private page = new BehaviorSubject<number>(0);

    private value = new BehaviorSubject<IConnectorData<T>>(undefined);
    public value$ = this.value.asObservable();

    constructor(public limit = 20) {
        this.query.subscribe(() => {
            this.page.next(0);
        });

        this.page.pipe(
            switchMap(() => {
                return this.Get();
            })
        ).subscribe(answer => {
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
        return (page - 1) * this.limit;
    }
}

export class ArrayConnector<T> extends Connector<T> {
    constructor(private array: Array<T>, limit: number) {
        super(limit);
    }

    Get(): Observable<IConnectorData<T>> {
        const answer: IConnectorData<T> = {
            data: this.array.slice(this.Offset, this.Limit),
            end: this.array.length <= this.Limit
        };
        return of(answer);
    }
}
