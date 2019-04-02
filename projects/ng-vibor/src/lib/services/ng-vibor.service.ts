import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgViborService<SModel> {
    /** Событие изменения текста в инпуте */
    public readonly query = new Subject<string>();

    // Choose
    private readonly chooseOptions = new Subject<SModel>();
    /** Событие выбора значения из списка опций */
    public readonly chooseOptions$ = this.chooseOptions.asObservable();

    // Remove
    private readonly removeOption = new Subject<SModel>();
    /** Событие удаления значения */
    public readonly removeOption$ = this.removeOption.asObservable();


    /** Событие открытия списка опций */
    private readonly showOptions = new Subject<boolean>();
    public readonly showOptions$ = this.showOptions.asObservable();


    /** Метод отправляет выбранный элемент в компонент формы */
    public ChooseOption(value: SModel) {
        this.chooseOptions.next(value);
    }
    /** Метод отправляет выбранный элемент в компонент формы */
    public RemoveOption(value: SModel) {
        this.removeOption.next(value);
    }

    /** Закрытие панели */
    public HideOptions(): void {
        this.showOptions.next(false);
    }

    /** Открытие панели */
    public ShowOptions(): void {
        this.showOptions.next(true);
    }

    constructor() {
        this.chooseOptions.subscribe(() => {
            this.HideOptions();
        });
    }
}
