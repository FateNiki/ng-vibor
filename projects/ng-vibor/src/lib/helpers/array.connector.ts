import { Observable, of } from 'rxjs';
import { Connector, IConnectorData } from './connector';
import { map } from 'rxjs/operators';

export class ArrayConnector<S, F> extends Connector<S, F> {
    constructor(private array: Array<S> = [], limit: number, Comparator?: (a: S, b: S) => boolean) {
        super(limit);
        if (Comparator) {
            this.Comparator = Comparator;
        }
    }

    GetList(query: string, page: number): Observable<IConnectorData<S>> {
        if (!this.array) {
            throw new Error('array is not Array');
        }
        if (this.Offset(page) < 0) {
            throw new Error('Offset < 0');
        }
        if (this.Limit(page) <= this.Offset(page)) {
            throw new Error('Limit <= Offset');
        }

        const data = this.array.filter(
            e => !query || (e.toString()).toLowerCase().includes(query.toLowerCase())
        );

        const answer: IConnectorData<S> = {
            data: data.slice(this.Offset(page), this.Limit(page)),
            length: data.length
        };
        return of(answer);
    }

    public TransformBack(a) {
        return a;
        // if (a instanceof Array) {
        //     return a.map(v1 => this.array.find(v2 => v2 === v1)).filter(v2 => !!v2);
        // } else {
        //     return this.array.find(v2 => v2 === a);
        // }
    }


}
