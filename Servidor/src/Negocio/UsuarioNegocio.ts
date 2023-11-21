import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad';
import UsuarioDatos from '../datos/UsuarioDatos';
import UsuarioEntidad from '../entidades/UsuarioEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class UsuarioNegocio {
  static async insert(usuario: UsuarioEntidad, detalle?: UsuarioProfesorEntidad): Promise<Respuesta> {
    try {
      return UsuarioDatos.insert(usuario, detalle);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(usuario: UsuarioEntidad): Promise<Respuesta> {
    try {
      return UsuarioDatos.update(usuario);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      return UsuarioDatos.updateEstado(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return UsuarioDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getAll(tipo: string): Promise<Respuesta> {
    try {
      return UsuarioDatos.getAll(tipo);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(tipo: string): Promise<Respuesta> {
    try {
      return UsuarioDatos.getEnabled(tipo);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return UsuarioDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getByUser(usuario: string, pswd: string): Promise<Respuesta> {
    try {
      return UsuarioDatos.getByUser(usuario, pswd);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Devuelve una Promise rechazada con el error
    }
  }
}

export default UsuarioNegocio;
