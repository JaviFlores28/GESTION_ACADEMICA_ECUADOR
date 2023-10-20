import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuarioLogin } from '../modelos/interfaces/usuario-Login.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = ' http://localhost:3000/api'; // Reemplaza con tu URL

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`);
  }

  login(usuario: usuarioLogin): Observable<any> {
    return this.http.patch(`${this.apiUrl}/loginUsuario`, usuario);
  }

}
