import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

import { UsuarioLogin } from '../modelos/interfaces/usuario-Login.interface';
import { Usuario } from '../modelos/interfaces/Usuario.interface';
import { params } from '../modelos/Params/params';
import { Respuesta } from '../modelos/interfaces/respuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = ' http://localhost:3000/api'; // Reemplaza con tu URL

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`);
  }

  post(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, usuario);
  }

  put(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario`, usuario);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario${id}`);
  }

  searchById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}/usuario/${id}`);
  }

  updatePswd(id: string, pswdNew: string, pswdOld: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuario/${id}`, { pswdNew, pswdOld });
  }

  validarUsuario(usuario: UsuarioLogin): Observable<Respuesta> {
    return this.http.patch<Respuesta>(`${this.apiUrl}/validarUsuario`, usuario);
  }

  login(usuario: Usuario): void {
    localStorage.setItem(params.KEY_NAME, btoa(JSON.stringify(usuario.USR_ID)));
  }

  logout(): void {
    localStorage.removeItem(params.KEY_NAME);
  }

  isLoggedIn(): boolean {
    const userString = localStorage.getItem(params.KEY_NAME);
    return !!userString;
  }

  async getUserLogged(): Promise<Usuario | null> {
    const id = localStorage.getItem(params.KEY_NAME);
    if (!id) { return null; }
    const parsedId = JSON.parse(atob(id));
    try {
      const response = await lastValueFrom(this.searchById(parsedId));
      if (!response) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async hasRol(rol: string): Promise<boolean> {
    const user = await this.getUserLogged();
    if (!user) return false;

    return (user.ROL_PRF === 1 && rol === 'P') ||
      (user.ROL_ADMIN === 1 && rol === 'A') ||
      (user.ROL_REPR === 1 && rol === 'R');
  }

}

