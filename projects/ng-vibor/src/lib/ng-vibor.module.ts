import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TestViborComponent } from './components/ng-vibor-test.component';
import { OptionsViewerComponent } from './components/options-viewer/options-viewer.component';
import { QueryInputComponent } from './components/query-input/query-input.component';
import { ViborSelectComponent } from './components/vibor-select/vibor-select.component';

@NgModule({
    declarations: [
        TestViborComponent,
        OptionsViewerComponent,
        QueryInputComponent,
        ViborSelectComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ScrollingModule
    ],
    exports: [
        TestViborComponent,
        ViborSelectComponent
    ]
})
export class NgViborModule { }
