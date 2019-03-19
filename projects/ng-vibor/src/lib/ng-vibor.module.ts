import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgViborComponent } from './components/ng-vibor.component';
import { OptionsViewerComponent } from './components/options-viewer/options-viewer.component';
import { QueryInputComponent } from './components/query-input/query-input.component';

@NgModule({
    declarations: [
        NgViborComponent,
        OptionsViewerComponent,
        QueryInputComponent
    ],
    imports: [
        ReactiveFormsModule,
        ScrollingModule
    ],
    exports: [
        NgViborComponent
    ]
})
export class NgViborModule { }
