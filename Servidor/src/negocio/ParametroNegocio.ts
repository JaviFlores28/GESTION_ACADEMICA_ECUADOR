
import ParametroDatos from '../datos/ParametroDatos';
import ParametroEntidad from '../entidades/ParametroEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class ParametroNegocio {
  
  static async insert(parametro: ParametroEntidad ): Promise<Respuesta> {
    try {
      return ParametroDatos.insert(parametro );
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async update(parametro: ParametroEntidad): Promise<Respuesta> {
    try {
      return ParametroDatos.update(parametro);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ParametroDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ParametroDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return ParametroDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return ParametroDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ParametroDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
}

export default ParametroNegocio;