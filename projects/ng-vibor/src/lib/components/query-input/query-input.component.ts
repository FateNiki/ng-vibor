import { Component, OnInit } from '@angular/core';
import { NgViborService } from '../../services/ng-vibor.service';

@Component({
    selector: 'vibor-query-input',
    templateUrl: './query-input.component.html',
    styleUrls: ['./query-input.component.scss']
})
export class QueryInputComponent {
    static readonly emittedKey = ['ArrowUp', 'ArrowDown', 'Enter'];

    constructor(private vs: NgViborService) { }

    public EmitKeyPress(event: KeyboardEvent): void {
        if (QueryInputComponent.emittedKey.includes(event.key)) {
            this.vs.inputKeyEvent.next(event);
        }
    }
}
