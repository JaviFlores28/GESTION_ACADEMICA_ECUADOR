
import baseDatos from '../Datos/BaseDatos';
import Parcial from '../Entidades/ParcialEntidad';
import { v4 as uuidv4 } from 'uuid';


class ParcialNegocio {
  
  static async getParcial(): Promise<{ data: Parcial[], message: string }> {
    try {
      let data = 'SELECT * FROM parcial';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Parcial[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledParcial(): Promise<{ data: Parcial[], message: string }> {
    try {
      let data = 'SELECT * FROM parcial where Estado=1';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Parcial[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Parcial | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM parcial WHERE PRCL_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Parcial no encontrado');
      }
      let newParcial = rows[0] as Parcial;
      
      return { data: newParcial, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addParcial(parcial: Parcial): Promise<{ data: string | null, message: string }> {
    try {
      if (!parcial.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Parcial no tiene la estructura esperada.');
      }
      parcial.PRCL_ID = uuidv4(); //asigna un identificador unico
      
      let data = parcial.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Parcial');
      }
      return { data:parcial.PRCL_ID, message: 'Se creo correctamente' }; // Retorna el ID del Parcial
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteParcial(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM parcial WHERE PRCL_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Parcial');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateParcial(parcial: Parcial): Promise<{ data: boolean, message: string }> {
    try {
      if (!parcial.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Parcial no tiene la estructura esperada.');
      }
      let data = parcial.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Parcial');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default ParcialNegocio;