
import ProfesorAsignaturaParaleloDatos from '../Datos/ProfesorAsignaturaParaleloDatos';
import ProfesorAsignaturaParaleloEntidad from '../Entidades/ProfesorAsignaturaParaleloEntidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class ProfesorAsignaturaParaleloNegocio {
  
  static async insert(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad ): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.insert(profesor_asignatura_paralelo );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.update(profesor_asignatura_paralelo);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getById(id);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default ProfesorAsignaturaParaleloNegocio;