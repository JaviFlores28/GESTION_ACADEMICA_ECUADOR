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
  providedIn: 'root',
})
export class UsuarioService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/usuario'; // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(tipo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=all&tipo=${tipo}`).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=id&id=${id}`).pipe(catchError(this.handleError));
  }

  getEnabled(tipo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=enabled&tipo=${tipo}`).pipe(catchError(this.handleError));
  }

  put(usuario: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, usuario).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(catchError(this.handleError));
  }

  post(usuario: Usuario, detalle?: UsuarioProfesor): Observable<any> {
    if (detalle) {
      const request = {usuario: usuario, detalle:detalle };
      return this.http.post(this.apiUrl, request).pipe(catchError(this.handleError));
    } else {
      const request = {usuario: usuario, detalle: null };
      return this.http.post(this.apiUrl, request).pipe(catchError(this.handleError));
    }
  }

  updatePswd(data: any): Observable<any> {
    const request = { type: 'updatePswd', data: data };
    return this.http.patch(`${this.apiUrl}/${data.id}`, request).pipe(catchError(this.handleError));
  }

  updateEstado(arrayData: any): Observable<any> {
    const request = {type: 'updateEstado', data: arrayData };
    return this.http.patch(this.apiUrl, request).pipe(catchError(this.handleError));
  }
  
  setLocal(usuario: Usuario): void {
    localStorage.setItem(variables.KEY_NAME, btoa(JSON.stringify(usuario.USR_ID)));
  }

  removeLocal(): void {
    localStorage.removeItem(variables.KEY_NAME);
  }

  getUserLoggedId() {
    const USR_ID = localStorage.getItem(variables.KEY_NAME);
    return USR_ID ? JSON.parse(atob(USR_ID)) : '';
  }


  async getUserLogged(): Promise<Usuario | null> {
    const id = this.getUserLoggedId();
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

 
}
