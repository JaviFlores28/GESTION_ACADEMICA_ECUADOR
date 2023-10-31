import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, of, switchMap } from 'rxjs';
import { variables } from '../modelos/variables/variables';
import { ErrorHandlerService } from './error-handler.service';
import { Respuesta } from '../modelos/interfaces_sistema/respuesta.interface';
import { UsuarioLogin } from '../modelos/interfaces_sistema/usuario-Login.interface';
import { DetalleUsuarioProfesor } from '../modelos/interfaces/DetalleUsuarioProfesor.interface';
import { DetalleUsuarioProfesorService } from './detalle-usuario-profesor.service';
import { Usuario } from '../modelos/interfaces/Usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ErrorHandlerService {
  private apiUrl = variables.URL_API + '/usuario' // Reemplaza con tu URL

  constructor(private http: HttpClient, private detalleService: DetalleUsuarioProfesorService) {
    super();
  }

  get(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError));
  }

  getEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}Enabled`).pipe(
      catchError(this.handleError));
  }


  post(usuario: Usuario, detalle?: DetalleUsuarioProfesor): Observable<any> {
    if (detalle) {
      return this.http.post(this.apiUrl, { usuario, detalle }).pipe(catchError(this.handleError));
    } else {
      return this.http.post(this.apiUrl, { usuario }).pipe(catchError(this.handleError));
    }
  }


  put(usuario: Usuario): Observable<any> {
    return this.http.put(this.apiUrl, usuario).pipe(
      catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError));
  }

  searchById(id: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError));
  }

  updatePswd(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${data.id}`, { pswdNew: data.pswdNew, pswdOld: data.pswdOld }).pipe(
      catchError(this.handleError));
  }

  validarUsuario(usuario: UsuarioLogin): Observable<Respuesta> {
    return this.http.patch<Respuesta>(`${this.apiUrl}Validar`, usuario).pipe(
      catchError(this.handleError));
  }

  login(usuario: Usuario): void {
    localStorage.setItem(variables.KEY_NAME, btoa(JSON.stringify(usuario.USR_ID)));
  }

  logout(): void {
    localStorage.removeItem(variables.KEY_NAME);
  }


  getUserLoggedId() {
    const userId = localStorage.getItem(variables.KEY_NAME);
    return userId ? JSON.parse(atob(userId)) : '';
  }

  isLoggedIn(): boolean {
    const userString = localStorage.getItem(variables.KEY_NAME);
    return !!userString;
  }

  async getUserLogged(): Promise<Usuario | null> {
    const id = this.getUserLoggedId()
    try {
      const response = await lastValueFrom(this.searchById(id));
      if (!response) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async hasRol(rol: string): Promise<boolean> {
    const user = await this.getUserLogged();
    if (!user) return false;

    return (user.ROL_PRF === 1 && rol === 'P') ||
      (user.ROL_ADMIN === 1 && rol === 'A') ||
      (user.ROL_REPR === 1 && rol === 'R');
  }

}

