import { Injectable } from '@angular/core';
import { CalificacionesCuantitativas } from '../interfaces/CalificacionesCuantitativas.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Respuesta } from '../sistema/interfaces/respuesta.interface';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CalififcacionCuantitativaService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/calificacionesCuantitativas'; // Reemplaza con tu URL

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

  post(calificacionesCuantitativas: CalificacionesCuantitativas): Observable<any> {
    return this.http.post(this.apiUrl, calificacionesCuantitativas).pipe(catchError(this.handleError));
  }

  put(calificacionesCuantitativas: CalificacionesCuantitativas): Observable<any> {
    return this.http.put(this.apiUrl, calificacionesCuantitativas).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(catchError(this.handleError));
  }

  updateEstado(arrayData: any): Observable<any> {
    const request = {type: 'updateEstado', data: arrayData };
    return this.http.patch(this.apiUrl, request).pipe(catchError(this.handleError));
  }
}
