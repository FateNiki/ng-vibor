import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgViborService<SModel> {
    /** Событие изменения текста в инпуте */
    public readonly query = new Subject<string>();

    /** Событие закрытия списка опций */
    private readonly chooseOptions = new Subject<SModel>();
    public readonly chooseOptions$ = this.chooseOptions.asObservable();


    /** Событие открытия списка опций */
    private readonly showOptions = new Subject<boolean>();
    public readonly showOptions$ = this.showOptions.asObservable();


    public ChooseOption(value: SModel) {
        this.chooseOptions.next(value);
    }

    public HideOptions(): void {
        this.showOptions.next(false);
    }

    public ShowOptions(): void {
        this.showOptions.next(true);
    }

    // Constructor
    constructor() {
        this.chooseOptions.subscribe(() => {
            this.HideOptions();
        });
    }
}
