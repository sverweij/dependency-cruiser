import { throwError } from './observable/throwError';


export class Observable<T> {

  /**
   * @constructor
   */
  constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  // HACK: Since TypeScript inherits static properties too, we have to
  // fight against TypeScript here so Subject can have a different static create signature
  /**
   * Creates a new cold Observable by calling the Observable constructor
   * @static true
   * @owner Observable
   * @method create
   * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
   * @return {Observable} a new cold observable
   * @nocollapse
   */
  static create: Function = <T>(subscribe?: (subscriber: Subscriber<T>) => TeardownLogic) => {
    return new Observable<T>(subscribe);
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<any>): TeardownLogic {
    // const { source } = this;
    return source && source.subscribe(subscriber);
  }

  // /**
  //  * @nocollapse
  //  * @deprecated In favor of throwError creation function: import { throwError } from 'rxjs';
  //  */
  // static throw: typeof throwError;

}
