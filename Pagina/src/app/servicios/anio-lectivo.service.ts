import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../sistema/interfaces/respuesta.interface';
import { AnioLectivo } from '../interfaces/AnioLectivo.interface';

@Injectable({
  providedIn: 'root',
})
export class AnioLectivoService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/aniolectivo'; // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=all`).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=id&id=${id}`).pipe(catchError(this.handleError));
  }

  getEnabled(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=enabled`).pipe(catchError(this.handleError));
  }

  post(anioLectivo: AnioLectivo): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.apiUrl, anioLectivo).pipe(catchError(this.handleError));
  }

  put(anioLectivo: AnioLectivo): Observable<Respuesta> {
    return this.http.put<Respuesta>(this.apiUrl, anioLectivo).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete<Respuesta>(`${this.apiUrl}?id=${id}`).pipe(catchError(this.handleError));
  }
}
