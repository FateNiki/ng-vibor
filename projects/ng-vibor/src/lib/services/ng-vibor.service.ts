import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgViborService {
  constructor() { }

  public inputKeyEvent = new Subject<KeyboardEvent>();
}
