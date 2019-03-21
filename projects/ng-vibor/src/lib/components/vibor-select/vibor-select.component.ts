import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef } from '@angular/core';

export const VIBOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ViborSelectComponent),
    multi: true
};

@Component({
    selector: 'vibor-select',
    templateUrl: './vibor-select.component.html',
    styleUrls: ['./vibor-select.component.scss'],
    providers: [VIBOR_VALUE_ACCESSOR]
})
export class ViborSelectComponent<SModel, FModel> implements OnInit, ControlValueAccessor {
    private localValue: FModel;

    set value(value: any) {
        this.localValue = value;
        this.notifyValueChange();
    }

    get value(): any {
        return this.localValue;
    }

    constructor() { }

    notifyValueChange(): void {
        if (this.onChange) {
            this.onChange(this.value);
        }
    }

    ngOnInit(): void {

    }

    writeValue(obj: any): void {
        this.localValue = obj;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    // Declaration events
    onChange: (value) => {};
    onTouched: () => {};

    // Register events
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
}
