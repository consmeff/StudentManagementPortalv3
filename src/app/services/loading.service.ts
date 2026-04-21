import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _loading = signal<boolean>(false);
  private loadingCounter = 0;

  readonly loading = this._loading.asReadonly();
  public loading$ = toObservable(this._loading);

  show(): void {
    this.loadingCounter++;
    if (this.loadingCounter === 1) {
      this._loading.set(true);
    }
  }

  hide(): void {
    if (this.loadingCounter > 0) {
      this.loadingCounter--;
    }
    
    if (this.loadingCounter === 0) {
      this._loading.set(false);
    }
  }

  forceHide(): void {
    this.loadingCounter = 0;
    this._loading.set(false);
  }

  isLoading(): boolean {
    return this._loading();
  }
}
