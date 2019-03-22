import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { Connector } from '../../helpers/connector';

export const VIBOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
// tslint:disable-next-line: no-use-before-declare
    useExisting: forwardRef(() => ViborSelectComponent),
    multi: true
};

@Component({
    selector: 'vibor-select',
    templateUrl: './vibor-select.component.html',
    styleUrls: ['./vibor-select.component.scss'],
    providers: [VIBOR_VALUE_ACCESSOR]
})
export class ViborSelectComponent<SModel = any, FModel = any> implements OnInit, ControlValueAccessor {
    // Declaration events
    onChange: (value: FModel) => {};
    onTouched: () => {};

    // Inputs
    @Input() connector: Connector<SModel, FModel>;

    // Local variable
    private localFValue: FModel;
    private localSValue: SModel;

    constructor() { }

    ngOnInit(): void {    }

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

    writeValue(obj: FModel): void {
        this.localFValue = obj;
        this.localSValue = this.connector.TransformBack(obj);
    }

    setDisabledState(isDisabled: boolean): void {
    }

    // Register events
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
}
