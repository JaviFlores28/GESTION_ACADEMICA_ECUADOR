
import PeriodoDatos from '../datos/PeriodoDatos';
import PeriodoEntidad from '../entidades/PeriodoEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class PeriodoNegocio {
  
  static async insert(periodo: PeriodoEntidad ): Promise<Respuesta> {
    try {
      return PeriodoDatos.insert(periodo );
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async update(periodo: PeriodoEntidad): Promise<Respuesta> {
    try {
      return PeriodoDatos.update(periodo);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return PeriodoDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return PeriodoDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return PeriodoDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return PeriodoDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return PeriodoDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
}

export default PeriodoNegocio;