import { Observable, Subject } from 'rxjs';

export class ObservableBus<T> extends Observable<T> {
  protected _subject$ = new Subject<T>();

  constructor() {
    super();
    this.source = this._subject$;
  }

  protected get subject$() {
    return this._subject$;
  }
}
