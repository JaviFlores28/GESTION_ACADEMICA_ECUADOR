
import EstudianteDatos from '../datos/EstudianteDatos';
import EstudianteEntidad from '../entidades/EstudianteEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class EstudianteNegocio {
  
  static async insert(estudiante: EstudianteEntidad ): Promise<Respuesta> {
    try {
      return EstudianteDatos.insert(estudiante );
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async update(estudiante: EstudianteEntidad): Promise<Respuesta> {
    try {
      return EstudianteDatos.update(estudiante);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return EstudianteDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return EstudianteDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return EstudianteDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return EstudianteDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return EstudianteDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
}

export default EstudianteNegocio;