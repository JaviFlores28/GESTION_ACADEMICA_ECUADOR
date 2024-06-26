import CalificacionesCuantitativasDatos from '../datos/CalificacionesCuantitativasDatos';
import CalificacionesCuantitativasEntidad from '../entidades/CalificacionesCuantitativasEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class CalificacionesCuantitativasNegocio {
  static async insert(calificaciones_cuantitativas: CalificacionesCuantitativasEntidad): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.insert(calificaciones_cuantitativas);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(calificaciones_cuantitativas: CalificacionesCuantitativasEntidad): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.update(calificaciones_cuantitativas);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(id: string): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.updateEstado(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}

export default CalificacionesCuantitativasNegocio;
