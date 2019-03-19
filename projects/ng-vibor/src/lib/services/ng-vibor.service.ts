import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgViborService {
  public readonly inputKeyEvent = new Subject<KeyboardEvent>();
  public readonly query = new BehaviorSubject<string>(undefined);

  public readonly showOptions = new Subject<void>();
  public readonly hideOptions = new Subject<void>();
}
