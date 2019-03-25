import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgViborService } from '../../services/ng-vibor.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'vibor-query-input',
    templateUrl: './query-input.component.html',
    styleUrls: ['./query-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryInputComponent<SModel = any> {
    static readonly emittedKey = ['ArrowUp', 'ArrowDown', 'Enter'];

    public query = new FormControl(undefined);

    private blurTimer;

    constructor(private vs: NgViborService<SModel>) {
        this.query.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(newValue =>  {
            this.vs.query.next(newValue);
        });
    }

    public EmitKeyPress(event: KeyboardEvent): void {
        if (QueryInputComponent.emittedKey.includes(event.key)) {
            if (event.key === 'Enter') {
                (event.target as HTMLInputElement).blur();
            }
            this.vs.inputKeyEvent.next(event);
        }
    }

    public Focus() {
        if (this.blurTimer) clearTimeout(this.blurTimer);
        this.vs.showOptions.next();
    }

    public Blur() {
        this.blurTimer = setTimeout(() => {
            this.vs.hideOptions.next();
        }, 100);
    }
}
