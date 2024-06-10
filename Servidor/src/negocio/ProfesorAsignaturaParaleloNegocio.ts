import ProfesorAsignaturaParaleloDatos from '../datos/ProfesorAsignaturaParaleloDatos';
import ProfesorAsignaturaParaleloEntidad from '../entidades/ProfesorAsignaturaParaleloEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class ProfesorAsignaturaParaleloNegocio {
  static async insert(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.insert(profesor_asignatura_paralelo);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.update(profesor_asignatura_paralelo);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(id: string): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.updateEstado(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getByPrf(data: any): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getByPrf(data);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
  static async insertMasivo(data: any): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.insertMasivo(data);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}

export default ProfesorAsignaturaParaleloNegocio;
