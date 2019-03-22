import { ArrayConnector } from './array.connector';

describe('Connector', () => {
    const limit = 12;
    let connector: ArrayConnector<number, number>;

    beforeEach(() => {
        const array = (new Array(111)).fill(Math.random());
        connector = new ArrayConnector<number, number>(array, limit);
    });

    it('Created', () => {
        expect(connector).toBeTruthy();
    });

    it('First page is Load', (done) => {
        connector.GetList(undefined, 0).subscribe(newValue => {
            expect(newValue.data.length).toBe(limit);
            done();
        });
    });
});
