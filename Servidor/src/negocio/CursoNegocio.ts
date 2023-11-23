
import CursoDatos from '../datos/CursoDatos';
import CursoEntidad from '../entidades/CursoEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class CursoNegocio {
  
  static async insert(curso: CursoEntidad ): Promise<Respuesta> {
    try {
      return CursoDatos.insert(curso );
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async update(curso: CursoEntidad): Promise<Respuesta> {
    try {
      return CursoDatos.update(curso);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return CursoDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return CursoDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return CursoDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return CursoDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return CursoDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
}

export default CursoNegocio;