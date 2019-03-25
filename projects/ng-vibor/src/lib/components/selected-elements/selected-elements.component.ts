import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vibor-selected-elements',
  templateUrl: './selected-elements.component.html',
  styleUrls: ['./selected-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedElementsComponent<SModel> {
    @Input() value: SModel;

    constructor() { }
}
