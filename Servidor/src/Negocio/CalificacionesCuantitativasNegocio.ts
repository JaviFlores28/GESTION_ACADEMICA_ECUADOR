
import CalificacionesCuantitativasDatos from '../Datos/CalificacionesCuantitativasDatos';
import CalificacionesCuantitativasEntidad from '../Entidades/CalificacionesCuantitativasEntidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class CalificacionesCuantitativasNegocio {
  
  static async insert(calificaciones_cuantitativas: CalificacionesCuantitativasEntidad ): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.insert(calificaciones_cuantitativas );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(calificaciones_cuantitativas: CalificacionesCuantitativasEntidad): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.update(calificaciones_cuantitativas);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return CalificacionesCuantitativasDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default CalificacionesCuantitativasNegocio;