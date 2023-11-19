
import CursoDatos from '../Datos/CursoDatos';
import CursoEntidad from '../Entidades/CursoEntidad';
import { Respuesta } from '../Default/Interfaces/Respuesta';

class CursoNegocio {
  
  static async insert(curso: CursoEntidad ): Promise<Respuesta> {
    try {
      return CursoDatos.insert(curso );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(curso: CursoEntidad): Promise<Respuesta> {
    try {
      return CursoDatos.update(curso);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return CursoDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return CursoDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return CursoDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return CursoDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return CursoDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default CursoNegocio;