import AsignaturaDatos from '../datos/AsignaturaDatos';
import AsignaturaEntidad from '../entidades/AsignaturaEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class AsignaturaNegocio {
  static async insert(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      return AsignaturaDatos.insert(asignatura);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      return AsignaturaDatos.update(asignatura);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(id: string): Promise<Respuesta> {
    try {
      return AsignaturaDatos.updateEstado(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return AsignaturaDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return AsignaturaDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return AsignaturaDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return AsignaturaDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}

export default AsignaturaNegocio;
