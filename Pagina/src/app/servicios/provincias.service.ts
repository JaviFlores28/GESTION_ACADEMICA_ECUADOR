import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  private url ='https://gist.githubusercontent.com/emamut/6626d3dff58598b624a1/raw/166183f4520c4603987c55498df8d2983703c316/provincias.json';

  constructor(private http: HttpClient) { }

  getAllDataProvincias(){
    return this.http.get(this.url).pipe();
  }
}
