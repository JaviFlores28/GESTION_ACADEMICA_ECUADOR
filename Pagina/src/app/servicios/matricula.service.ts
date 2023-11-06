import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../modelos/interfaces_sistema/respuesta.interface';
import { Matricula } from '../modelos/interfaces/Matricula.interface';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/matricula'// Reemplaza con tu URL

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
  
  getByCurso(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}ByCurso/${id}`).pipe(
      catchError(this.handleError));
  }

  post(matricula: Matricula): Observable<any> {
    return this.http.post(this.apiUrl, matricula).pipe(
      catchError(this.handleError));
  }

  put(matricula: Matricula): Observable<any> {
    return this.http.put(this.apiUrl, matricula).pipe(
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
