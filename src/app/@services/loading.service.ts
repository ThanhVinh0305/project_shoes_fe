import { Injectable, computed, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private count = signal(0);
  private readonly loading$ = new BehaviorSubject(this.count());

  getObservable() {
    return this.loading$.asObservable();
  }

  increase() {
    this.count.update((value) => ++value);
    this.loading$.next(this.count());
  }

  decrease() {
    if (this.count() < 0) {
      this.count.set(0);
    } else {
      this.count.update(value => --value);
    }
    this.loading$.next(this.count())
  }
}
