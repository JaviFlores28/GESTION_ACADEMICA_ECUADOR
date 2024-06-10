import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom } from 'rxjs';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../sistema/interfaces/Respuesta.interface';
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
 
}
