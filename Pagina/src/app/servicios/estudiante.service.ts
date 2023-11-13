import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../modelos/interfaces/respuesta.interface';
import { Estudiante } from '../interfaces/Estudiante.interface';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/estudiante'// Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=all`).pipe(
      catchError(this.handleError));
  }

  getById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=id&id=${id}`).pipe(
      catchError(this.handleError));
  }

  getEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=enabled`).pipe(
      catchError(this.handleError));
  }

  post(estudiante: Estudiante): Observable<any> {
    return this.http.post(this.apiUrl, estudiante).pipe(
      catchError(this.handleError));
  }

  put(estudiante: Estudiante): Observable<any> {
    return this.http.put(this.apiUrl, estudiante).pipe(
      catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError));
  }
  
  getNoMatriculados(): Observable<any> {
    return this.http.get(`${this.apiUrl}-no-matriculados`).pipe(
      catchError(this.handleError));
  }
}
