import { Observable, of } from 'rxjs';
import { Connector, IConnectorData } from './connector';

export class ArrayConnector<T> extends Connector<T> {
    constructor(private array: Array<T> = [], limit: number, Comparator?: (a: T, b: T) => boolean) {
        super(limit);
        if (Comparator) {
            this.Comparator = Comparator;
        }
    }

    protected GetList(): Observable<IConnectorData<T>> {
        if (!this.array) {
            throw new Error('array is not Array');
        }
        if (this.Offset < 0) {
            throw new Error('Offset < 0');
        }
        if (this.Limit <= this.Offset) {
            throw new Error('Limit <= Offset');
        }

        const answer: IConnectorData<T> = {
            data: this.array.slice(this.Offset, this.Limit),
            end: this.array.length <= this.Limit
        };
        return of(answer);
    }
}
