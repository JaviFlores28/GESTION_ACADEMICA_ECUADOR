import UsuarioProfesorDatos from '../datos/UsuarioProfesorDatos';
import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class UsuarioProfesorNegocio {
  static async insert(usuario_profesor: UsuarioProfesorEntidad): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.insert(usuario_profesor);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(usuario_profesor: UsuarioProfesorEntidad): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.update(usuario_profesor);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.updateEstado(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return UsuarioProfesorDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
}

export default UsuarioProfesorNegocio;
