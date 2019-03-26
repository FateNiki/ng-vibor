import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgViborService } from '../../services/ng-vibor.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
    selector: 'vibor-query-input',
    templateUrl: './query-input.component.html',
    styleUrls: ['./query-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryInputComponent<SModel = any> {
    static readonly emittedKey = ['ArrowUp', 'ArrowDown', 'Enter'];
    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    public query = new FormControl(undefined);

    constructor(private vs: NgViborService<SModel>) {
        this.query.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(newValue =>  {
            this.vs.query.next(newValue);
        });

        this.vs.showOptions$.pipe(
            filter(show => show === false && this.input.nativeElement === document.activeElement)
        ).subscribe(() => {
            this.input.nativeElement.blur();
        });
    }

    public EmitKeyPress(event: KeyboardEvent): void {
        if (QueryInputComponent.emittedKey.includes(event.key)) {
            this.vs.inputKeyEvent.next(event);
        }
    }

    public Focus() {
        this.vs.ShowOptions();
    }

    public Blur() {
        setTimeout(() => this.vs.HideOptions(), 100);
    }
}
