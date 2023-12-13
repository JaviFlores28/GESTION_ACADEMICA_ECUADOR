import EscalasReferencialesCalificacionesDatos from '../datos/EscalasReferencialesCalificacionesDatos';
import EscalasReferencialesCalificacionesEntidad from '../entidades/EscalasReferencialesCalificacionesEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class EscalasReferencialesCalificacionesNegocio {
  static async insert(escalas_referenciales_calificaciones: EscalasReferencialesCalificacionesEntidad): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.insert(escalas_referenciales_calificaciones);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(escalas_referenciales_calificaciones: EscalasReferencialesCalificacionesEntidad): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.update(escalas_referenciales_calificaciones);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.updateEstado(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return EscalasReferencialesCalificacionesDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}

export default EscalasReferencialesCalificacionesNegocio;
