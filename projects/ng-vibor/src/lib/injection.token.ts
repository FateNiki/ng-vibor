import { InjectionToken, TemplateRef } from '@angular/core';

/** Токен DataSouce */
export const DataSourceToken = new InjectionToken<{}>('DataSource');

/** Токен высоты элемента */
export const ItemHeightToken = new InjectionToken<number>('ItemHeight');

/** Токен высоты VirtualScroll */
export const OptionsViewerSizeToken = new InjectionToken<number>('OptionsViewerSize');

/** Токен шаблона для опции */
export const OptionsTemplateToken = new InjectionToken<TemplateRef<any>>('OptionsTemplateToken');
