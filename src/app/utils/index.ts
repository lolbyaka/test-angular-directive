import { Observable, fromEvent } from "rxjs";
import { map, startWith } from "rxjs/operators";

export const windowResizeObservable = (): Observable<number> => {
  return fromEvent(window, "resize").pipe(
    map((event) => (event.target as Window).innerWidth),
    startWith(window.innerWidth)
  );
};
