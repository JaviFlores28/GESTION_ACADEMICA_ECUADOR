
import PeriodoDatos from '../Datos/PeriodoDatos';
import PeriodoEntidad from '../Entidades/PeriodoEntidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class PeriodoNegocio {
  
  static async insert(periodo: PeriodoEntidad ): Promise<Respuesta> {
    try {
      return PeriodoDatos.insert(periodo );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(periodo: PeriodoEntidad): Promise<Respuesta> {
    try {
      return PeriodoDatos.update(periodo);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return PeriodoDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return PeriodoDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return PeriodoDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return PeriodoDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return PeriodoDatos.getById(id);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default PeriodoNegocio;