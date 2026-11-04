import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private uid: string = '';

  setUid(uid: string): void {
    this.uid = uid;
    sessionStorage.setItem('app_uid', uid);
  }

  getUid(): string {
    return this.uid || sessionStorage.getItem('app_uid') || '';
  }
}