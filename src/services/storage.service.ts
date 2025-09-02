import { DatePipe } from '@angular/common';
import { inject, Injectable, InjectionToken } from '@angular/core';
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  public storage = inject(BROWSER_STORAGE);
  public datePipe = inject(DatePipe);

  get(key: string) {
    return this.storage.getItem(key);
  }
  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  setVersion() {
    const today = new Date();
    const versionJSON = {version: this.datePipe.transform(today, 'dd/MM/yyyy')};
    this.storage.setItem('version', JSON.stringify(versionJSON));
  }
}
