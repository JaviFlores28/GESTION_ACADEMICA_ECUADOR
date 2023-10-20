import { Injectable } from '@angular/core';
import { params } from '../modelos/Params/params';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(value: any) {
    localStorage.setItem(params.KEY_ENCRYPT, JSON.stringify(value));
  }

  getItem(): any {
    const item = localStorage.getItem(params.KEY_ENCRYPT);
    return item ? JSON.parse(item) : null;
  }

  removeItem() {
    localStorage.removeItem(params.KEY_ENCRYPT);
  }
}
