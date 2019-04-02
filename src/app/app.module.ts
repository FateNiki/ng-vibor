import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgViborModule } from 'ng-vibor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, NgViborModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
