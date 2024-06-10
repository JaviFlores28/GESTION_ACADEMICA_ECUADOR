import EstudianteCursoDatos from '../datos/EstudianteCursoDatos';
import EstudianteCursoEntidad from '../entidades/EstudianteCursoEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class EstudianteCursoNegocio {
  static async insert(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.insert(estudiante_curso);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.update(estudiante_curso);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(id: string): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.updateEstado(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
  static async updateEstadoMasivo(ids: string[]): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.updateEstadoMasivo(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getNoMatriculados();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.getByCurso(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
  static async insertMasivo(data: any): Promise<Respuesta> {
    try {
      return EstudianteCursoDatos.insertMasivo(data);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}

export default EstudianteCursoNegocio;
