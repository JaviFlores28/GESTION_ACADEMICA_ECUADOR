import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../modelos/interfaces_sistema/respuesta.interface';
import { Area } from '../modelos/interfaces/Area.interface';

@Injectable({
  providedIn: 'root'
})
export class AreaService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/area'// Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl).pipe(
      catchError(this.handleError));
  }

  getEnabled(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}Enabled`).pipe(
      catchError(this.handleError));
  }

  post(area: Area): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.apiUrl, area).pipe(
      catchError(this.handleError));
  }

  put(area: Area): Observable<Respuesta> {
    return this.http.put<Respuesta>(this.apiUrl, area).pipe(
      catchError(this.handleError));
  }

  delete(id: string): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError));
  }

  searchById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError));
  }
}
