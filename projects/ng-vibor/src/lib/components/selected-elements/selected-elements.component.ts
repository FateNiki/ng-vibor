import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgViborService } from '../../services/ng-vibor.service';

@Component({
  selector: 'vibor-selected-elements',
  templateUrl: './selected-elements.component.html',
  styleUrls: ['./selected-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedElementsComponent<SModel> {
    @Input() value: SModel;

    constructor(private vs: NgViborService<SModel>) { }

    public Remove() {
        this.vs.ChooseOption(null);
    }
}
