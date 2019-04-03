import { Component, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { NgViborService } from '../../services/ng-vibor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'vibor-selected-elements',
  templateUrl: './selected-elements.component.html',
  styleUrls: ['./selected-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedElementsComponent<SModel> implements OnDestroy {
    @Input() value: SModel;
    @Input() selectedTemplate: TemplateRef<any>;

    private subs = new Subscription();
    public disabled = false;

    constructor(
        private vs: NgViborService<SModel>,
        private cdr: ChangeDetectorRef
    ) {
        this.subs.add(
            this.vs.disabled$.subscribe(isDisabled => {
                this.disabled = isDisabled;
                this.cdr.markForCheck();
            })
        );
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public Remove() {
        this.vs.RemoveOption(this.value);
    }
}
