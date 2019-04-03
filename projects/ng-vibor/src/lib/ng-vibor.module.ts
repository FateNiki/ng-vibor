import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { OptionsViewerComponent } from './components/options-viewer/options-viewer.component';
import { QueryInputComponent } from './components/query-input/query-input.component';
import { ViborSelectComponent } from './components/vibor-select/vibor-select.component';
import { SelectedElementsComponent } from './components/selected-elements/selected-elements.component';

@NgModule({
    declarations: [
        OptionsViewerComponent,
        QueryInputComponent,
        ViborSelectComponent,
        SelectedElementsComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        ScrollingModule,
        OverlayModule,
        PortalModule
    ],
    exports: [
        ViborSelectComponent
    ],
    entryComponents: [
        OptionsViewerComponent
    ]
})
export class NgViborModule { }
