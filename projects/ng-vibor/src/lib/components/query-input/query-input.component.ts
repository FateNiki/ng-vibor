import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgViborService } from '../../services/ng-vibor.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
            this.vs.query.next(newValue);
        });
    }

    /** ПОдписка на отображения списка опций */
    private get ShowOptionsSubscription(): Subscription {
        return this.vs.showOptions$.pipe(
            filter(show => show === false && this.input.nativeElement === document.activeElement)
        ).subscribe(() => {
            this.input.nativeElement.blur();
        });
    }

    /** Callback установки фокуса */
    public Focus() {
        this.vs.ShowOptions();
    }
}
