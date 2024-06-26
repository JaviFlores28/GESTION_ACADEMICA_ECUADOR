import AreaDatos from '../datos/AreaDatos';
import AreaEntidad from '../entidades/AreaEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class AreaNegocio {
  static async insert(area: AreaEntidad): Promise<Respuesta> {
    try {
      return AreaDatos.insert(area);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(area: AreaEntidad): Promise<Respuesta> {
    try {
      return AreaDatos.update(area);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(id: string): Promise<Respuesta> {
    try {
      return AreaDatos.updateEstado(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      return AreaDatos.delete(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      return AreaDatos.getAll();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      return AreaDatos.getEnabled();
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      return AreaDatos.getById(id);
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}

export default AreaNegocio;
