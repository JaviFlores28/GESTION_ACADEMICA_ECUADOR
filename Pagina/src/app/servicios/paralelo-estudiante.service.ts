import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ParaleloEstudianteService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/paraleloestudiante'// Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  getEnabled(paraleloId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Enabled/${paraleloId}`).pipe(
      catchError(this.handleError));
  }
}
