import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom } from 'rxjs';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../sistema/interfaces/respuesta.interface';
import { UsuarioLogin } from '../sistema/interfaces/usuario-Login.interface';
import { UsuarioProfesor } from '../interfaces/UsuarioProfesor.interface';
import { Usuario } from '../interfaces/Usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/usuario' // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(tipo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=all&tipo=${tipo}`).pipe(
      catchError(this.handleError));
  }

  getById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=id&id=${id}`).pipe(
      catchError(this.handleError));
  }

  getByUser(usuario: UsuarioLogin): Observable<Respuesta> {
    return this.http.patch<Respuesta>(`${this.apiUrl}?by=usuario`, usuario).pipe(
      catchError(this.handleError));
  }

  getEnabled(tipo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=enabled&tipo=${tipo}`).pipe(
      catchError(this.handleError));
  }

  put(usuario: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, usuario).pipe(
      catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError));
  }

  post(usuario: Usuario, detalle?: UsuarioProfesor): Observable<any> {
    if (detalle) {
      return this.http.post(this.apiUrl, { usuario, detalle }).pipe(catchError(this.handleError));
    } else {
      return this.http.post(this.apiUrl, { usuario }).pipe(catchError(this.handleError));
    }
  }

  updatePswd(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${data.id}`, { pswdNew: data.pswdNew, pswdOld: data.pswdOld }).pipe(
      catchError(this.handleError));
  }


  setLocal(usuario: Usuario): void {
    localStorage.setItem(variables.KEY_NAME, btoa(JSON.stringify(usuario.USR_ID)));
  }

  removeLocal(): void {
    localStorage.removeItem(variables.KEY_NAME);
  }

  getUserLoggedId() {
    const userId = localStorage.getItem(variables.KEY_NAME);
    return userId ? JSON.parse(atob(userId)) : '';
  }

  isLoggedIn(): boolean {
    const userString = localStorage.getItem(variables.KEY_NAME);
    return !!userString;
  }

  async getUserLogged(): Promise<Usuario | null> {
    const id = this.getUserLoggedId()
    try {
      const response = await lastValueFrom(this.getById(id));
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

