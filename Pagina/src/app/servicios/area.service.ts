import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../sistema/interfaces/Respuesta.interface';
import { Area } from '../interfaces/Area.interface';

@Injectable({
  providedIn: 'root',
})
export class AreaService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/area'; // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=all`).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=id&id=${id}`).pipe(catchError(this.handleError));
  }

  getEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=enabled`).pipe(catchError(this.handleError));
  }

  post(area: Area): Observable<any> {
    return this.http.post(this.apiUrl, area).pipe(catchError(this.handleError));
  }

  put(area: Area): Observable<any> {
    return this.http.put(this.apiUrl, area).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(catchError(this.handleError));
  }

  updateEstado(id: string): Observable<any> {
    const request = { type: 'updateEstado', data: id };
    return this.http.patch(this.apiUrl, request).pipe(catchError(this.handleError));
  }
}
