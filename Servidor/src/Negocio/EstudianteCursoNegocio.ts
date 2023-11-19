
import EstudianteCursoDatos from '../Datos/EstudianteCursoDatos';
import EstudianteCursoEntidad from '../Entidades/EstudianteCursoEntidad';
import { Respuesta } from '../sistema/Interfaces/Respuesta';

class EstudianteCursoNegocio {
  
  static async insert(estudiante_curso: EstudianteCursoEntidad ): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.insert(estudiante_curso );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.update(estudiante_curso);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getNoMatriculados();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
}

export default EstudianteCursoNegocio;