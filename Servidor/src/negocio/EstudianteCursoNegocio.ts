
import EstudianteCursoDatos from '../datos/EstudianteCursoDatos';
import EstudianteCursoEntidad from '../entidades/EstudianteCursoEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class EstudianteCursoNegocio {
  
  static async insert(estudiante_curso: EstudianteCursoEntidad ): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.insert(estudiante_curso );
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async update(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.update(estudiante_curso);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getNoMatriculados();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getByCurso(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.insertMasivo(data);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }
}

export default EstudianteCursoNegocio;