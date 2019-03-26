import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgViborService<SModel> {
    /** События для обработки нажатий клавиш */
    public readonly inputKeyEvent = new Subject<KeyboardEvent>();

    /** Событие изменения текста в инпуте */
    public readonly query = new Subject<string>();

    /** Событие закрытия списка опций */
    public readonly chooseOptions = new Subject<SModel>();


    /** Событие открытия списка опций */
    private readonly showOptions = new Subject<boolean>();
    public readonly showOptions$ = this.showOptions.asObservable();

    public HideOptions(): void {
        this.showOptions.next(false);
    }

    public ShowOptions(): void {
        this.showOptions.next(true);
    }
}
