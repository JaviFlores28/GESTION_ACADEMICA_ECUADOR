import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Respuesta } from '../sistema/interfaces/respuesta.interface';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EstudianteCursoParaleloService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/estudianteCursoParalelo'// Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  get(): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=all`).pipe(catchError(this.handleError));
  }

  getEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=enabled`).pipe(
      catchError(this.handleError));
  }

  getById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}?by=id&id=${id}`).pipe(
      catchError(this.handleError));
  }

  post(matriculas: any): Observable<any> {
    return this.http.post(this.apiUrl, matriculas).pipe(
      catchError(this.handleError));
  }

  put(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data).pipe(
      catchError(this.handleError));
  }

  delete(ids: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}-delete`, ids).pipe(
      catchError(this.handleError)
    );
  }

  patchUpdateEstado(arrayData: any): Observable<any> {
    return this.http.patch(this.apiUrl, { masivo: true, type: 'updateEstado', data: arrayData }).pipe(
      catchError(this.handleError));
  }

  postMasivo(arrayData: any): Observable<any> {
    return this.http.post(this.apiUrl, { masivo: true, data: arrayData }).pipe(
      catchError(this.handleError));
  }

  getByParalelo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?by=paralelo&id=${id}`).pipe(
      catchError(this.handleError));
  }

}
