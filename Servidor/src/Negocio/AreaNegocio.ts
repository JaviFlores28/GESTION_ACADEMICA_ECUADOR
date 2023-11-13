
import AreaDatos from '../Datos/AreaDatos';
import AreaEntidad from '../Entidades/AreaEntidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class AreaNegocio {
  
  static async insert(area: AreaEntidad ): Promise<Respuesta> {
    try {
      return AreaDatos.insert(area );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(area: AreaEntidad): Promise<Respuesta> {
    try {
      return AreaDatos.update(area);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return AreaDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return AreaDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return AreaDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return AreaDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return AreaDatos.getById(id);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default AreaNegocio;