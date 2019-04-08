import {
    Component, Input, OnInit,
    forwardRef, OnDestroy,
    ChangeDetectorRef, ChangeDetectionStrategy,
    Injector, ViewContainerRef, ViewEncapsulation, TemplateRef, StaticProvider
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
    OverlayRef, Overlay,
    ViewportRuler, FlexibleConnectedPositionStrategy,
    OverlayConfig, PositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { Connector } from '../../helpers/connector';
import { DataSourceConnector } from '../../helpers/datasource';
import { NgViborService } from '../../services/ng-vibor.service';

import { OptionsViewerComponent } from '../options-viewer/options-viewer.component';
import { DataSourceToken, ItemHeightToken, OptionsViewerSizeToken, OptionsTemplateToken } from '../../injection.token';
import { ViborComponent } from '../shared.vibor.component';

export const VIBOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ViborMultiselectComponent),
    multi: true
};

@Component({
    selector: 'vibor-multiselect',
    templateUrl: './vibor-multiselect.component.html',
    styleUrls: ['./vibor-multiselect.component.scss'],
    providers: [VIBOR_VALUE_ACCESSOR, NgViborService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ViborMultiselectComponent<SModel = any, FModel = any>
    extends ViborComponent<SModel, FModel>
    implements OnInit, OnDestroy, ControlValueAccessor {

    // Models
    protected localFValue: FModel[];
    protected localSValue: SModel[] = [];

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
        return this.vs.chooseOptions$.subscribe(addedValue => {
            this.value = this.CreateNewArray(addedValue);
            this.cdr.markForCheck();
        });
    }

    /** Подписчик на удаление опции */
    protected get RemoveOptionSubscription(): Subscription {
        return this.vs.removeOption$.pipe(
            map(deletedValue => this.DeleteElement(deletedValue))
        ).subscribe(deleteResult => {
            this.value = deleteResult;
            this.cdr.markForCheck();
        });
    }

    /** Установка значений внутри компонента */
    set value(value: SModel[]) {
        this.localSValue = value;
        this.localFValue = this.TransformArray();
        this.notifyValueChange();
    }

    // Получение локального значения
    get value(): SModel[] {
        return this.localSValue;
    }

    /** Запись значений снаружи */
    writeValue(obj: FModel[]): void {
        if (obj instanceof Array) {
            const sValue: SModel[] = this.connector.TransformBack(obj);
            if (sValue) {
                this.localFValue = obj;
                this.localSValue = sValue;
            } else {
                this.value = [];
            }
        }

        this.cdr.markForCheck();
    }

    /**  Создание нового списка убирая одинаковые элементы */
    private CreateNewArray(addedElement: SModel): SModel[] {
        return [...this.value, addedElement];
    }

    private TransformArray(): FModel[] {
        return this.value.map(v => this.connector.Transform(v));
    }

    private DeleteElement(deletedValue: SModel): SModel[] {
        const result = this.value.slice();
        const index = result.findIndex(v => {
            return this.connector.Comparator(deletedValue, v);
        });
        if (index >= 0) {
            result.splice(index, 1);
        }
        return result;
    }

}
