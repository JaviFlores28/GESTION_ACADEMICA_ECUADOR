import EstudianteCursoParaleloDatos from '../Datos/EstudianteCursoParaleloDatos';
import EstudianteCursoParaleloEntidad from '../Entidades/EstudianteCursoParaleloEntidad';
import { Respuesta } from '../sistema/Interfaces/Respuesta';

class EstudianteCursoParaleloNegocio {
  static async insert(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.insert(estudiante_curso_paralelo);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.update(estudiante_curso_paralelo);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.updateEstado(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoParaleloDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
}

export default EstudianteCursoParaleloNegocio;
