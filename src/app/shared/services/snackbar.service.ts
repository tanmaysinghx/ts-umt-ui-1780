import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SnackbarState {
  message: string;
  type: 'info' | 'danger' | 'success' | 'warning' | 'dark';
  duration: number;
  show: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackbarSubject = new BehaviorSubject<SnackbarState>({
    message: '',
    type: 'info',
    duration: 3000,
    show: false,
  });

  public snackbarState$: Observable<SnackbarState> = this.snackbarSubject.asObservable();

  show(message: string, type: SnackbarState['type'] = 'info', duration: number = 5000) {
    this.snackbarSubject.next({ message, type, duration, show: true });
    
    // Auto-hide logic can be handled here or in the component listening to this state.
    // Handling it here ensures consistency.
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.snackbarSubject.next({ ...this.snackbarSubject.value, show: false });
  }
}
