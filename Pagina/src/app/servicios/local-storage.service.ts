import { Injectable } from '@angular/core';
import { params } from '../modelos/Params/params';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(value: any) {
    localStorage.setItem(params.KEY_NAME, btoa(JSON.stringify(value)));
  }

  getItem(): any {
    const item = localStorage.getItem(params.KEY_NAME);
    return item ? JSON.parse(atob(item)) : null;
  }

  removeItem() {
    localStorage.removeItem(params.KEY_NAME);
  }
}
