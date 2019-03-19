import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class NgViborService<SModel> {
    /** События для обработки нажатий клавиш */
    public readonly inputKeyEvent = new Subject<KeyboardEvent>();

    /** Событие изменения текста в инпуте */
    public readonly query = new Subject<string>();

    /** Событие открытия списка опций */
    public readonly showOptions = new Subject<void>();

    /** Событие закрытия списка опций */
    public readonly hideOptions = new Subject<void>();

    /** Событие закрытия списка опций */
    public readonly selectElement = new Subject<SModel>();

    constructor() {
        this.selectElement.subscribe(() => {
            this.hideOptions.next();
        });
    }
}
