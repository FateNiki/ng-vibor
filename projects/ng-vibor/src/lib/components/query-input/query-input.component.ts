import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgViborService } from '../../services/ng-vibor.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'vibor-query-input',
    templateUrl: './query-input.component.html',
    styleUrls: ['./query-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryInputComponent {
    static readonly emittedKey = ['ArrowUp', 'ArrowDown', 'Enter'];

    public query = new FormControl(undefined);

    constructor(private vs: NgViborService) {
        this.query.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(
            newValue => this.vs.query.next(newValue)
        );
    }

    public EmitKeyPress(event: KeyboardEvent): void {
        if (QueryInputComponent.emittedKey.includes(event.key)) {
            this.vs.inputKeyEvent.next(event);
        }
    }

    public Focus() {
        this.vs.showOptions.next();
    }

    public Blur() {
        this.vs.hideOptions.next();
    }
}
