import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuarioLogin } from '../modelos/interfaces/usuario-Login.interface';
import { Usuario } from '../modelos/interfaces/Usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = ' http://localhost:3000/api'; // Reemplaza con tu URL
  private userlocal!: UsuarioService; // Puedes definir una interfaz para la información del usuario

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`);
  }

  post(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, usuario);
  }

  put(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario`, usuario);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario${id}`);
  }

  searchById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${id}`);
  }

  updatePswd(id: string, pswdNew: string, pswdOld: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuario/${id}`, { pswdNew, pswdOld });
  }

  validarUsuario(usuario: usuarioLogin): Observable<any> {
    return this.http.patch(`${this.apiUrl}/validarUsuario`, usuario);
  }

  login(usuario: any): void {
    this.userlocal = usuario;
    console.log(this.userlocal);
  }

  getUserInfo(): any {
    return this.userlocal;
  }


}
