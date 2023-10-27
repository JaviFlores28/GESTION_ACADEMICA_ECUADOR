import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Usuario } from '../modelos/interfaces/Usuario.interface';
import { Respuesta } from '../modelos/interfaces/respuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/usuario'// Reemplaza con tu URL

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

  post(representante: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, representante).pipe(
      catchError(this.handleError));
  }

  put(representante: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, representante).pipe(
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
}
