import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ProfesorAsignaturaParalelo } from '../interfaces/ProfesorAsignaturaParalelo.interface';
import { Respuesta } from '../sistema/interfaces/Respuesta.interface';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ProfesorAsignaturaService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/profesorasignaturaparalelo'; // Reemplaza con tu URL

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

  post(profesorAsignaturaParalelo: ProfesorAsignaturaParalelo): Observable<any> {
    return this.http.post(this.apiUrl, profesorAsignaturaParalelo).pipe(catchError(this.handleError));
  }

  put(profesorAsignaturaParalelo: ProfesorAsignaturaParalelo): Observable<any> {
    return this.http.put(this.apiUrl, profesorAsignaturaParalelo).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(catchError(this.handleError));
  }

  updateEstado(arrayData: any): Observable<any> {
    const request = {type: 'updateEstado', data: arrayData };
    return this.http.patch(this.apiUrl, request).pipe(catchError(this.handleError));
  }

  postMasivo(arrayData: any): Observable<any> {
    return this.http.post(this.apiUrl, { masivo: true, data: arrayData }).pipe(catchError(this.handleError));
  }
  
  getByPrf(data: any): Observable<any> {
    const request = {type: 'getByPrf', data: data };
    return this.http.patch(this.apiUrl, request).pipe(catchError(this.handleError));
  }
  
}
