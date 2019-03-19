import { Component } from '@angular/core';
import { ArrayConnector } from 'ng-vibor';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'vibor-demo';
    public arrayConnector = new ArrayConnector<number, number>(Array.from({length: 500}).map(Math.random), 50);
}
