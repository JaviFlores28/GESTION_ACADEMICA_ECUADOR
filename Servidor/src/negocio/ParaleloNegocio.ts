
import ParaleloDatos from '../datos/ParaleloDatos';
import ParaleloEntidad from '../entidades/ParaleloEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class ParaleloNegocio {
  
  static async insert(paralelo: ParaleloEntidad ): Promise<Respuesta> {
    try {
      return ParaleloDatos.insert(paralelo );
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async update(paralelo: ParaleloEntidad): Promise<Respuesta> {
    try {
      return ParaleloDatos.update(paralelo);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ParaleloDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ParaleloDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return ParaleloDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return ParaleloDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ParaleloDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
}

export default ParaleloNegocio;