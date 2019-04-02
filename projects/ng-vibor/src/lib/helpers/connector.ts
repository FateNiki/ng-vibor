import { Observable } from 'rxjs';

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
