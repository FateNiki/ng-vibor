import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewContainerRef } from '@angular/core';
import { Connector, DataSourceConnector } from '../../helpers/connector';
import { NgViborService } from '../../services/ng-vibor.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { OverlayRef, Overlay, ViewportRuler, FlexibleConnectedPositionStrategy, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OptionsViewerComponent } from '../options-viewer/options-viewer.component';
import { DataSourceToken, ItemHeightToken, OptionsViewerSizeToken } from '../../injection.token';

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
    public optionsOpen: boolean;
    public loading: boolean;

    // Subscription
    private subs = new Subscription();
    private viewportSubscription = Subscription.EMPTY;

    // Overlays
    private _overlayRef: OverlayRef | null;
    private _portal: ComponentPortal<OptionsViewerComponent<SModel>> | null;
    private _positionStrategy: PositionStrategy;

    // Models
    private localFValue: FModel;
    private localSValue: SModel;

    constructor(
        private vs: NgViborService<SModel>,
        private cdr: ChangeDetectorRef,
        private overlay: Overlay,
        private viewportRuler: ViewportRuler,
        private viewContainerRef: ViewContainerRef,
    ) {
        this.subs.add(this.ShowOptionsSubscription);
        this.subs.add(this.ChooseOptionSubscription);
    }

    ngOnInit() {
        this.dataSource = new DataSourceConnector<SModel, FModel>(this.connector, this.vs);
        this.subs.add(this.LoadingSubscription);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    /** Подписчик на обработку загружаемых страниц */
    private get LoadingSubscription(): Subscription {
        return this.dataSource.loading$.subscribe(pages => {
            this.loading = pages.length > 0;
            this.cdr.markForCheck();
        });
    }

    /** Подписчик на выбор элемента из списка */
    private get ChooseOptionSubscription(): Subscription {
        return this.vs.chooseOptions.pipe(
            distinctUntilChanged()
        ).subscribe(newValue => {
            this.value = newValue;
            this.cdr.markForCheck();
        });
    }

    /** Подписчик на отображени и скрытие выпадающего списка */
    private get ShowOptionsSubscription(): Subscription {
        return this.vs.showOptions$.pipe(
            distinctUntilChanged()
        ).subscribe(open => {
            if (open) {
                this._attachOverlay();
            } else {
                this._detachOverlay();
            }
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
        this.cdr.markForCheck();
    }

    /** Установка атрибута disabled */
    setDisabledState(isDisabled: boolean): void {
        this.cdr.markForCheck();
    }

    // Register events
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }


    private _attachOverlay(): void {
        let overlayRef = this._overlayRef;
        this.optionsOpen = true;

        if (!overlayRef) {
            this._portal = this._getPortal();
            this._overlayRef = overlayRef = this.overlay.create(this._getOverlayConfig());


            // Use the `keydownEvents` in order to take advantage of
            // the overlay event targeting provided by the CDK overlay.
            overlayRef.keydownEvents().pipe(
                filter(event => {
                    return event.code === 'Escape' ||
                    event.code === 'ArrowUp' ||
                    event.code === 'ArrowDown' ||
                    event.code === 'Enter';
                }),
                map(event => {
                    if (event.code === 'Escape' || (event.code === 'ArrowUp' && event.altKey)) {
                        return 'close';
                    } else if (event.code === 'Enter') {
                        return 'choose';
                    } else if (event.code === 'ArrowUp') {
                        return 'up';
                    } else if (event.code === 'ArrowDown') {
                        return 'down';
                    }
                })
            ).subscribe(event => {
                // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
                // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
                switch (event) {
                    case 'choose':
                        const selectedElement = this.dataSource.selectedElement.value && this.dataSource.selectedElement.value.element;
                        this.vs.chooseOptions.next(selectedElement);
                        break;

                    case 'close':
                        this.vs.HideOptions();
                        break;

                    case 'up':
                        this.dataSource.SelectElement(-1);
                        break;

                    case 'down':
                        this.dataSource.SelectElement(1);
                        break;
                }
            });

            overlayRef.backdropClick().subscribe(() => {
                this.vs.HideOptions();
            })

            if (this.viewportRuler) {
                this.viewportSubscription = this.viewportRuler.change().subscribe(() => {
                    if (this.optionsOpen && overlayRef) {
                        overlayRef.updateSize({ width: this._getPanelWidth() });
                    }
                });
            }
        } else {
            const position = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;

            // Update the trigger, panel width and direction, in case anything has changed.
            position.setOrigin(this.viewContainerRef.element);
            overlayRef.updateSize({ width: this._getPanelWidth() });
        }

        if (overlayRef && !overlayRef.hasAttached()) {
            overlayRef.attach(this._portal);
            // this._closingActionsSubscription = this._subscribeToClosingActions();
        }
    }

    /** Closes the autocomplete suggestion panel. */
    private _detachOverlay(): void {
        if (!this.optionsOpen) {
            return;
        }

        this.optionsOpen = false;

        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            //   this._closingActionsSubscription.unsubscribe();
        }
    }

    private _getOverlayConfig(): OverlayConfig {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            width: this._getPanelWidth(),
            hasBackdrop: true,
            backdropClass: 'vibor-backdrop'
        });
    }

    private _getPortal(): ComponentPortal<OptionsViewerComponent<SModel>> {
        const injector = Injector.create({
            providers: [
                { provide: NgViborService, useValue: this.vs },
                { provide: DataSourceToken, useValue: this.dataSource },
                { provide: ItemHeightToken, useValue: 30 },
                { provide: OptionsViewerSizeToken, useValue: 300 },
            ]
        });
        return new ComponentPortal<OptionsViewerComponent<SModel>>(OptionsViewerComponent, this.viewContainerRef, injector);
    }

    private _getOverlayPosition(): PositionStrategy {
        this._positionStrategy = this.overlay.position()
            .flexibleConnectedTo(this.viewContainerRef.element)
            .withFlexibleDimensions(false)
            .withPush(false)
            .withPositions([
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top'
                },
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom',
                    panelClass: 'mat-vibor-panel-above'
                }
            ]);

        return this._positionStrategy;
    }

    private _getPanelWidth(): number | string {
        // TODO: panelWidth - инпут
        const panelWidth = undefined;
        return panelWidth || this._getHostWidth();
    }

    /** Returns the width of the input element, so the panel width can match it. */
    private _getHostWidth(): number {
        return this.viewContainerRef.element.nativeElement.getBoundingClientRect().width;
    }

}
