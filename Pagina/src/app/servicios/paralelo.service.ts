import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../sistema/interfaces/respuesta.interface';
import { Paralelo } from '../interfaces/Paralelo.interface';

@Injectable({
  providedIn: 'root'
})
export class ParaleloService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/paralelo'// Reemplaza con tu URL

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

  post(paralelo: Paralelo): Observable<any> {
    return this.http.post(this.apiUrl, paralelo).pipe(
      catchError(this.handleError));
  }

  put(paralelo: Paralelo): Observable<any> {
    return this.http.put(this.apiUrl, paralelo).pipe(
      catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError));
  }
}
