import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/generarpdf'; // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  post(data: any, html?: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf',
    });

    return this.http.post(this.apiUrl, { data, html }, {
      headers,
      responseType: 'blob', // Importante: responseType 'blob' para manejar contenido binario
    }).pipe(
      catchError(this.handleError)
    );
  }

}
