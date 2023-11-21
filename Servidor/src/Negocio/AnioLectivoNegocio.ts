import AnioLectivoDatos from '../Datos/AnioLectivoDatos';
import AnioLectivoEntidad from '../Entidades/AnioLectivoEntidad';
import { Respuesta } from '../sistema/Interfaces/Respuesta';

class AnioLectivoNegocio {
  static async insert(anio_lectivo: AnioLectivoEntidad): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.insert(anio_lectivo);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(anio_lectivo: AnioLectivoEntidad): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.update(anio_lectivo);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.updateEstado(ids);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return AnioLectivoDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
}

export default AnioLectivoNegocio;
