import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom } from 'rxjs';

import { UsuarioLogin } from '../modelos/interfaces/usuario-Login.interface';
import { Usuario } from '../modelos/interfaces/Usuario.interface';
import { variables } from '../modelos/variables/variables';
import { Respuesta } from '../modelos/interfaces/respuesta.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ErrorHandlerService {
  private apiUrl = variables.URL_API +'/usuario' // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError));
  }

  getEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}Enabled`).pipe(
      catchError(this.handleError));
  }

  post(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario).pipe(
      catchError(this.handleError));
  }

  put(usuario: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, usuario).pipe(
      catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError));
  }

  searchById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError));
  }

  updatePswd(id: string, pswdNew: string, pswdOld: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { pswdNew, pswdOld }).pipe(
      catchError(this.handleError));
  }

  validarUsuario(usuario: UsuarioLogin): Observable<Respuesta> {
    return this.http.patch<Respuesta>(`${this.apiUrl}Validar`, usuario).pipe(
      catchError(this.handleError));
  }

  login(usuario: Usuario): void {
    localStorage.setItem(variables.KEY_NAME, btoa(JSON.stringify(usuario.USR_ID)));
  }

  logout(): void {
    localStorage.removeItem(variables.KEY_NAME);
  }

  isLoggedIn(): boolean {
    const userString = localStorage.getItem(variables.KEY_NAME);
    return !!userString;
  }

  async getUserLogged(): Promise<Usuario | null> {
    const id = localStorage.getItem(variables.KEY_NAME);
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

