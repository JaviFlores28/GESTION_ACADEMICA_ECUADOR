
import ProfesorAsignaturaParaleloDatos from '../datos/ProfesorAsignaturaParaleloDatos';
import ProfesorAsignaturaParaleloEntidad from '../entidades/ProfesorAsignaturaParaleloEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class ProfesorAsignaturaParaleloNegocio {
  
  static async insert(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad ): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.insert(profesor_asignatura_paralelo );
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async update(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.update(profesor_asignatura_paralelo);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ProfesorAsignaturaParaleloDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
}

export default ProfesorAsignaturaParaleloNegocio;