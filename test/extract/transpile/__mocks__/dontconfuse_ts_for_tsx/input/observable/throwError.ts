import { Observable } from '../Observable';
import { SchedulerLike } from '../types';
import { Subscriber } from '../Subscriber';

export function throwError(error: any, scheduler?: SchedulerLike): Observable<never> {
  if (!scheduler) {
    return new Observable(subscriber => subscriber.error(error));
  } else {
    return new Observable(subscriber => scheduler.schedule(dispatch, 0, { error, subscriber }));
  }
}

interface DispatchArg {
  error: any;
  subscriber: Subscriber<any>;
}

function dispatch({ error, subscriber }: DispatchArg) {
  subscriber.error(error);
}
