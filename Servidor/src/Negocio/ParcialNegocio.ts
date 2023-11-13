
import ParcialDatos from '../Datos/ParcialDatos';
import ParcialEntidad from '../Entidades/ParcialEntidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class ParcialNegocio {
  
  static async insert(parcial: ParcialEntidad ): Promise<Respuesta> {
    try {
      return ParcialDatos.insert(parcial );
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(parcial: ParcialEntidad): Promise<Respuesta> {
    try {
      return ParcialDatos.update(parcial);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ParcialDatos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ParcialDatos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      return ParcialDatos.getAll();
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      return ParcialDatos.getEnabled();

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ParcialDatos.getById(id);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}

export default ParcialNegocio;