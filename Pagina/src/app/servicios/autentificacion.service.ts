import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom } from 'rxjs';
import { Respuesta } from '../sistema/interfaces/respuesta.interface';
import { UsuarioLogin } from '../sistema/interfaces/usuario-Login.interface';
import { variables } from '../sistema/variables/variables';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService extends ErrorHandlerService {
  private apiUrl = variables.URL_API; // Reemplaza con tu URL

  constructor(private http: HttpClient) {
    super();
  }

  login(usuario: UsuarioLogin): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.apiUrl + '/login', usuario, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  authentificated(TOKEN: string): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.apiUrl + '/authentificated', { TOKEN }, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  isLoggedIn(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl + '/isloggedin', { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getUser(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl + '/getuser', { withCredentials: true }).pipe(catchError(this.handleError));
  }

  enable2FA(TOKEN: string): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.apiUrl + '/enable2fa', { TOKEN }, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  disable2FA(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl + '/disable2fa', { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getQR(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl + '/getqr', { withCredentials: true }).pipe(catchError(this.handleError));
  }

  logout(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl + '/logout', { withCredentials: true }).pipe(catchError(this.handleError));
  }

  setUserIdLocal(USR_ID: string): void {
    localStorage.setItem(variables.KEY_NAME, btoa(JSON.stringify(USR_ID)));
  }

  getUserIdLocal() {
    const USR_ID = localStorage.getItem(variables.KEY_NAME);
    return USR_ID ? JSON.parse(atob(USR_ID)) : '';
  }

  removeUserIdLocal(): void {
    localStorage.removeItem(variables.KEY_NAME);
  }

  async hasRol(rol: string): Promise<boolean> {
    const user = await lastValueFrom(this.getUser()) as Respuesta;
    if (!user.response) return false;
    return (user.data.ROL_PRF === 1 && rol === 'P') || (user.data.ROL_ADMIN === 1 && rol === 'A') || (user.data.ROL_REPR === 1 && rol === 'R');
  }
}
