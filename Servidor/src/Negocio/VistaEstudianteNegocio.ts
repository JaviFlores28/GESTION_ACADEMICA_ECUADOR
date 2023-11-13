
import VistaEstudianteDatos from '../Datos/VistaEstudianteDatos';
import VistaEstudianteEntidad from '../Entidades/VistaEstudianteEntidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class VistaEstudianteNegocio {
  
  static async insert(vista_estudiante: VistaEstudianteEntidad ): Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.insert(vista_estudiante );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(vista_estudiante: VistaEstudianteEntidad): Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.update(vista_estudiante);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return VistaEstudianteDatos.getById(id);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default VistaEstudianteNegocio;