import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TestModuleMetadata } from '@angular/core/testing';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { OptionsViewerComponent } from './components/options-viewer/options-viewer.component';
import { QueryInputComponent } from './components/query-input/query-input.component';
import { ViborSelectComponent } from './components/vibor-select/vibor-select.component';
import { SelectedElementsComponent } from './components/selected-elements/selected-elements.component';

import { NgViborService } from './services/ng-vibor.service';
import { DataSourceConnector, Connector } from './helpers/connector';
import { ArrayConnector } from './helpers/array.connector';

export const TestViborModule: TestModuleMetadata = {
    declarations: [
        OptionsViewerComponent,
        QueryInputComponent,
        ViborSelectComponent,
        SelectedElementsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ScrollingModule
    ],
    providers: [NgViborService]
};

export function getConnector(): Connector {
    const limit = 12;
    const array = (new Array(111)).fill(Math.random());
    return new ArrayConnector(array, limit);
}

export function getDataSource(): DataSourceConnector<any, any> {
    const connector = getConnector();
    return new DataSourceConnector(connector, undefined);
}
