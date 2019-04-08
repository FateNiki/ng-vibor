import {
    OnInit, OnDestroy,
    Input, TemplateRef,
    StaticProvider, Injector,
    ChangeDetectorRef, ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
    OverlayRef, OverlayConfig, Overlay,
    PositionStrategy, FlexibleConnectedPositionStrategy,
    ViewportRuler
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { Connector } from '../helpers/connector';
import { DataSourceConnector } from '../helpers/datasource';

import { OptionsViewerComponent } from './options-viewer/options-viewer.component';
import { DataSourceToken, OptionsViewerSizeToken, OptionsTemplateToken, ItemHeightToken } from '../injection.token';
import { NgViborService } from '../services/ng-vibor.service';

export abstract class ViborComponent<SModel, FModel> implements OnInit, OnDestroy, ControlValueAccessor {
    // Declaration events
    onChange: (value: FModel) => {};
    onTouched: () => {};

    // Inputs
    @Input() connector: Connector<SModel, FModel>;
    @Input() selectedTemplate: TemplateRef<any>;
    @Input() optionsTemplate: TemplateRef<any>;

    // Local variable
    public dataSource: DataSourceConnector<SModel, FModel>;
    public optionsOpen: boolean;
    public loading: boolean;
    public disabled: boolean;

    // Subscription
    protected subs = new Subscription();
    private viewportSubscription = Subscription.EMPTY;

    // Overlays
    private _overlayRef: OverlayRef | null;
    private _portal: ComponentPortal<OptionsViewerComponent<SModel>> | null;
    private _positionStrategy: PositionStrategy;

    // Model
    protected abstract localFValue;
    protected abstract localSValue;

    constructor(
        protected vs: NgViborService<SModel>,
        protected cdr: ChangeDetectorRef,
        private overlay: Overlay,
        private viewportRuler: ViewportRuler,
        private viewContainerRef: ViewContainerRef,
    ) {
        this.subs.add(this.ShowOptionsSubscription);
        // this.subs.add(this.ChooseOptionSubscription);
        // this.subs.add(this.RemoveOptionSubscription);
    }

    ngOnInit() {
        this.dataSource = new DataSourceConnector<SModel, FModel>(this.connector, this.vs);
        this.subs.add(this.LoadingSubscription);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    // Abstract
    /** Подписчик на выбор элемента из списка */
    protected abstract get ChooseOptionSubscription(): Subscription;

    /** Подписчик на удаление опции */
    protected abstract get RemoveOptionSubscription(): Subscription;

    /** Установка значений внутри компонента
     * Незабыть this.notifyValueChange();
     */
    abstract set value(value);

    /** Установка значений внутри компонента */
    abstract get value();

    /** Запись значений снаружи */
    abstract writeValue(obj);


    // Release
    /** Подписчик на обработку загружаемых страниц */
    private get LoadingSubscription(): Subscription {
        return this.dataSource.loading$.subscribe(pages => {
            this.loading = pages.length > 0;
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
            this.onTouched();
            this.cdr.markForCheck();
        });
    }

    /** Метод уведомления о изменениях значения */
    notifyValueChange(): void {
        if (this.onChange) {
            this.onChange(this.localFValue);
        }
    }

    /** Установка атрибута disabled */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.vs.disabled$.next(isDisabled);
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
                        this.vs.ChooseOption(selectedElement);
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
            });

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
            backdropClass: 'vibor-backdrop',
            panelClass: ['vibor-options-panel']
        });
    }

    private _getPortal(): ComponentPortal<OptionsViewerComponent<SModel>> {
        const providers: StaticProvider[] = [
            { provide: NgViborService, useValue: this.vs },
            { provide: DataSourceToken, useValue: this.dataSource },
            { provide: ItemHeightToken, useValue: 30 },
            { provide: OptionsViewerSizeToken, useValue: 300 }
        ];

        if (this.optionsTemplate) {
            providers.push({
                provide: OptionsTemplateToken,
                useValue: this.optionsTemplate
            });
        }

        const injector = Injector.create({ providers });
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
                    panelClass: 'vibor-options-above'
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
