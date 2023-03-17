class Observable {
  /**
   * @constructor
   */
  constructor(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber) {
    // const { source } = this;
    return source && source.subscribe(subscriber);
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
Observable.create = (subscribe) => {
  return new Observable(subscribe);
};
export { Observable };
