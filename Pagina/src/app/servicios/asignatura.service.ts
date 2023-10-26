import { Injectable } from '@angular/core';
import { Asignatura } from '../modelos/interfaces/Asignatura.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Respuesta } from '../modelos/interfaces/respuesta.interface';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/asignatura'// Reemplaza con tu URL

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

  post(asignatura: Asignatura): Observable<any> {
    return this.http.post(this.apiUrl, asignatura).pipe(
      catchError(this.handleError));
  }

  put(asignatura: Asignatura): Observable<any> {
    return this.http.put(this.apiUrl, asignatura).pipe(
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