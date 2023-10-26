
import baseDatos from '../Datos/BaseDatos';
import Paralelo from '../Entidades/ParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';


class ParaleloNegocio {
  
  static async getParalelo(): Promise<{ data: Paralelo[], message: string }> {
    try {
      let data = 'SELECT * FROM paralelo';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Paralelo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledParalelo(): Promise<{ data: Paralelo[], message: string }> {
    try {
      let data = 'SELECT * FROM paralelo where Estado=1';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Paralelo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Paralelo | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM paralelo WHERE PRLL_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Paralelo no encontrado');
      }
      let newParalelo = rows[0] as Paralelo;
      
      return { data: newParalelo, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addParalelo(paralelo: Paralelo): Promise<{ data: string | null, message: string }> {
    try {
      if (!paralelo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Paralelo no tiene la estructura esperada.');
      }
      paralelo.PRLL_ID = uuidv4(); //asigna un identificador unico
      
      let data = paralelo.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Paralelo');
      }
      return { data:paralelo.PRLL_ID, message: 'Se creo correctamente' }; // Retorna el ID del Paralelo
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteParalelo(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM paralelo WHERE PRLL_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Paralelo');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateParalelo(paralelo: Paralelo): Promise<{ data: boolean, message: string }> {
    try {
      if (!paralelo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Paralelo no tiene la estructura esperada.');
      }
      let data = paralelo.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Paralelo');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default ParaleloNegocio;