import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { NgViborService } from '../../services/ng-vibor.service';

@Component({
    selector: 'vibor-query-input',
    templateUrl: './query-input.component.html',
    styleUrls: ['./query-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryInputComponent<SModel = any> implements OnDestroy {
    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    public query = new FormControl(undefined);
    private subs = new Subscription();

    constructor(private vs: NgViborService<SModel>) {
        this.subs.add(this.ValueChangesSubscription);
        this.subs.add(this.ShowOptionsSubscription);
        this.subs.add(this.DisabledSubscription);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    /** Подписка на изменение значения в инпуте */
    private get ValueChangesSubscription(): Subscription {
        return this.query.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(newValue =>  {
            this.vs.query$.next(newValue);
        });
    }

    /** Подписка на отображения списка опций */
    private get ShowOptionsSubscription(): Subscription {
        return this.vs.showOptions$.pipe(
            filter(show => show === false && this.input.nativeElement === document.activeElement)
        ).subscribe(() => {
            this.input.nativeElement.blur();
        });
    }

    private get DisabledSubscription(): Subscription {
        return this.vs.disabled$.pipe(
            distinctUntilChanged(),
        ).subscribe(isDisabled => {
            if (isDisabled) {
                this.query.disable();
            } else {
                this.query.enable();
            }
        });
    }

    /** Callback установки фокуса */
    public Focus() {
        this.vs.ShowOptions();
    }
}
