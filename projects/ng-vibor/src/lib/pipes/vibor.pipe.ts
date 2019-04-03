import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighLightPipe implements PipeTransform {
    constructor(private ds: DomSanitizer) { }

    transform(element: any, search: string): SafeHtml {
        const text: string = element.toString();
        const str = search ? text.replace(new RegExp(search, 'i'), `<span class="highlight">${search}</span>`) : text;
        return this.ds.bypassSecurityTrustHtml(str);
    }
}
