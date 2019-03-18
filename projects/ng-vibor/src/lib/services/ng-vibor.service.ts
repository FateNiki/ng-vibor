import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgViborService {
  constructor() { }

  public inputKeyEvent = new Subject<KeyboardEvent>();
  public query = new BehaviorSubject<string>(undefined);
}
