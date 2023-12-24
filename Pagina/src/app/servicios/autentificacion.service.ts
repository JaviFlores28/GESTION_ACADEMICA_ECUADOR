import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
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
    return this.http.get<Respuesta>(this.apiUrl + '/perfil', { withCredentials: true }).pipe(catchError(this.handleError));
  }

  async hasRol(rol: string): Promise<boolean> {
    // const user = await this.getUserLogged();
    //if (!user) return false;
    return true;
    //return (user.ROL_PRF === 1 && rol === 'P') || (user.ROL_ADMIN === 1 && rol === 'A') || (user.ROL_REPR === 1 && rol === 'R');
  }
}
