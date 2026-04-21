import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';


@Injectable({
  providedIn: 'root'
})
export class WidgetsService {
  
  
  private readonly _sidebarState = signal<sidebarStateDTO>({ isvisible: true });
  readonly sidebarState = this._sidebarState.asReadonly();
  public sidebarState$ = toObservable(this._sidebarState);

  constructor() {   }

  setSidebarState(state:sidebarStateDTO){
    this._sidebarState.set({ ...state });
  }
}
