import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Connector, DataSourceConnector } from '../../helpers/connector';
import { NgViborService } from '../../services/ng-vibor.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export const VIBOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ViborSelectComponent),
    multi: true
};

@Component({
    selector: 'vibor-select',
    templateUrl: './vibor-select.component.html',
    styleUrls: ['./vibor-select.component.scss'],
    providers: [VIBOR_VALUE_ACCESSOR, NgViborService],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    public loading: boolean = false;
    private subs = new Subscription();

    // Models
    private localFValue: FModel;
    private localSValue: SModel;

    constructor(
        private vs: NgViborService<SModel>,
        private cdr: ChangeDetectorRef
    ) {
        this.subs.add(this.vs.showOptions$.pipe(
            distinctUntilChanged()
        ).subscribe(event => {
            this.showOptions = event;
            this.cdr.markForCheck();
        }));

        this.subs.add(this.vs.chooseOptions.pipe(
            distinctUntilChanged()
        ).subscribe(newValue => {
            this.value = newValue;
            this.cdr.markForCheck();
        }));

        this.subs.add(this.vs.inputKeyEvent.pipe(
            filter(event => {
                return this.showOptions && event.code === 'Enter';
            }),
            map(() => {
                return this.dataSource.selectedElement.value && this.dataSource.selectedElement.value.element;
            })
        ).subscribe(selectedElement => {
            this.vs.chooseOptions.next(selectedElement);
            this.vs.HideOptions();
            this.cdr.markForCheck();
        }));
    }

    ngOnInit() {
        this.dataSource = new DataSourceConnector<SModel, FModel>(this.connector, this.vs);

        this.subs.add(this.dataSource.loading$.subscribe(pages => {
            console.log(pages);
            this.loading = pages.length > 0;
            this.cdr.markForCheck();
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
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
