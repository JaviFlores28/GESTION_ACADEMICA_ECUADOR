
import AsignaturaDatos from '../Datos/AsignaturaDatos';
import AsignaturaEntidad from '../Entidades/AsignaturaEntidad';
import { Respuesta } from '../sistema/Interfaces/Respuesta';

class AsignaturaNegocio {
  
  static async insert(asignatura: AsignaturaEntidad ): Promise<Respuesta> {
    try {
      return AsignaturaDatos.insert(asignatura );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      return AsignaturaDatos.update(asignatura);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return AsignaturaDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return AsignaturaDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return AsignaturaDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return AsignaturaDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return AsignaturaDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default AsignaturaNegocio;