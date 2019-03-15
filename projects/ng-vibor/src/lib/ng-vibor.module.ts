import { NgModule } from '@angular/core';
import { NgViborComponent } from './components/ng-vibor.component';
import { OptionsViewerComponent } from './components/options-viewer/options-viewer.component';

@NgModule({
  declarations: [NgViborComponent, OptionsViewerComponent],
  imports: [
  ],
  exports: [NgViborComponent]
})
export class NgViborModule { }
