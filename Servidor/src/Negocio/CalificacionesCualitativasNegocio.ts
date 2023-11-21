import CalificacionesCualitativasDatos from '../datos/CalificacionesCualitativasDatos';
import CalificacionesCualitativasEntidad from '../entidades/CalificacionesCualitativasEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class CalificacionesCualitativasNegocio {
  static async insert(calificaciones_cualitativas: CalificacionesCualitativasEntidad): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.insert(calificaciones_cualitativas);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(calificaciones_cualitativas: CalificacionesCualitativasEntidad): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.update(calificaciones_cualitativas);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.updateEstado(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return CalificacionesCualitativasDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
}

export default CalificacionesCualitativasNegocio;
