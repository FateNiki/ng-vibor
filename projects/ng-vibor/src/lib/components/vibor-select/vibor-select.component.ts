import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { Connector, DataSourceConnector } from '../../helpers/connector';
import { Subscription, merge } from 'rxjs';
import { NgViborService } from '../../services/ng-vibor.service';
import { tap, distinctUntilChanged } from 'rxjs/operators';

export const VIBOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ViborSelectComponent),
    multi: true
};

@Component({
    selector: 'vibor-select',
    templateUrl: './vibor-select.component.html',
    styleUrls: ['./vibor-select.component.scss'],
    providers: [VIBOR_VALUE_ACCESSOR, NgViborService]
})
export class ViborSelectComponent<SModel = any, FModel = any> implements OnInit, OnDestroy, ControlValueAccessor {
    // Declaration events
    onChange: (value: FModel) => {};
    onTouched: () => {};

    // Inputs
    @Input() connector: Connector<SModel, FModel>;

    // Local variable
    public dataSource: DataSourceConnector<SModel, FModel>;
    public showOptions: boolean;
    private showOptionsSub: Subscription;

    // Models
    private localFValue: FModel;
    private localSValue: SModel;

    constructor(private vs: NgViborService<SModel>) {
        this.showOptionsSub = merge(
            this.vs.hideOptions.pipe(
                tap(() => {
                    this.showOptions = false;
                })
            ),
            this.vs.showOptions.pipe(
                tap(() => this.showOptions = true)
            )
        ).subscribe();

        this.vs.chooseOptions.pipe(
            distinctUntilChanged()
        ).subscribe(newValue => {
            this.value = newValue;
        });
    }

    ngOnInit() {
        this.dataSource = new DataSourceConnector<SModel, FModel>(this.connector, this.vs);
    }

    ngOnDestroy() {
        if (this.showOptionsSub) this.showOptionsSub.unsubscribe();
    }

    /** Установка значений внутри компонента */
    set value(value: SModel) {
        this.localSValue = value;
        this.localFValue = this.connector.Transform(value);
        this.notifyValueChange();
    }

    // Получение локального значения
    get value(): SModel {
        return this.localSValue;
    }

    /** Метод уведомления о изменениях значения */
    notifyValueChange(): void {
        if (this.onChange) {
            this.onChange(this.localFValue);
        }
    }

    /** Запись значений снаружи */
    writeValue(obj: FModel): void {
        this.localFValue = obj;
        this.localSValue = this.connector.TransformBack(obj);
    }

    /** Установка атрибута disabled */
    setDisabledState(isDisabled: boolean): void {
    }

    // Register events
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
}
