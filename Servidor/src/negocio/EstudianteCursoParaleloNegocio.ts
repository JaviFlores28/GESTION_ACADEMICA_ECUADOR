
import EstudianteCursoParaleloDatos from '../datos/EstudianteCursoParaleloDatos';
import EstudianteCursoParaleloEntidad from '../entidades/EstudianteCursoParaleloEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class EstudianteCursoParaleloNegocio {
  
  static async insert(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad ): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.insert(estudiante_curso_paralelo );
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async update(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.update(estudiante_curso_paralelo);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.insertMasivo(data);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
   static async getByParalelo(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getByParalelo(id);
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }
}

export default EstudianteCursoParaleloNegocio;