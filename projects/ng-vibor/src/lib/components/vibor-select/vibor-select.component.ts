import {
    Component, OnInit,
    forwardRef, OnDestroy,
    ChangeDetectorRef, ChangeDetectionStrategy,
    ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
    Overlay,
    ViewportRuler
} from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NgViborService } from '../../services/ng-vibor.service';

import { ViborComponent } from '../shared.vibor.component';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ViborSelectComponent<SModel = any, FModel = any>
    extends ViborComponent<SModel, FModel>
    implements OnInit, OnDestroy, ControlValueAccessor {

    // Models
    public haveValue = false;
    protected localFValue: FModel;
    protected localSValue: SModel;

    constructor(
        vs: NgViborService<SModel>,
        cdr: ChangeDetectorRef,
        overlay: Overlay,
        viewportRuler: ViewportRuler,
        viewContainerRef: ViewContainerRef,
    ) {
        super(vs, cdr, overlay, viewportRuler, viewContainerRef);

        this.subs.add(this.ChooseOptionSubscription);
        this.subs.add(this.RemoveOptionSubscription);
    }

    /** Подписчик на выбор элемента из списка */
    protected get ChooseOptionSubscription(): Subscription {
        return this.vs.chooseOptions$.pipe(
            // distinctUntilChanged()
        ).subscribe(newValue => {
            this.haveValue = true;
            this.value = newValue;
            this.cdr.markForCheck();
        });
    }

    /** Подписчик на удаление опции */
    protected get RemoveOptionSubscription(): Subscription {
        return this.vs.removeOption$.pipe(
            // distinctUntilChanged()
            filter(deletedValue => this.connector.Comparator(deletedValue, this.value))
        ).subscribe(() => {
            this.haveValue = false;
            this.value = undefined;
            this.cdr.markForCheck();
        });
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

    /** Запись значений снаружи */
    writeValue(obj: FModel): void {
        if (obj !== null) {
            const sValue = this.connector.TransformBack(obj);
            if (sValue) {
                this.haveValue = true;
                this.localFValue = obj;
                this.localSValue = sValue;
            } else {
                this.value = undefined;
            }
        }

        this.cdr.markForCheck();
    }
}
