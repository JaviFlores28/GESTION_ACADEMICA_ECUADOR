
import baseDatos from '../Datos/BaseDatos';
import Parametro from '../Entidades/ParametroEntidad';
import { v4 as uuidv4 } from 'uuid';


class ParametroNegocio {
  
  static async getParametro(): Promise<{ data: Parametro[], message: string }> {
    try {
      let sql = 'SELECT * FROM parametro';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Parametro[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledParametro(): Promise<{ data: Parametro[], message: string }> {
    try {
      let sql = 'SELECT * FROM parametro where Estado=1';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Parametro[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Parametro | null; message: string }> {
    try {
      let sql = 'SELECT * FROM parametro WHERE PRMT_ID = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Parametro no encontrado');
      }
      let newParametro = rows[0] as Parametro;
      
      return { data: newParametro, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addParametro(parametro: Parametro): Promise<{ data: string | null, message: string }> {
    try {
      if (!parametro.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Parametro no tiene la estructura esperada.');
      }
      parametro.PRMT_ID = uuidv4(); //asigna un identificador unico
      let sql = parametro.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Parametro');
      }
      return { data:parametro.PRMT_ID, message: 'Se creo correctamente' }; // Retorna el ID del Parametro
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteParametro(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM parametro WHERE PRMT_ID = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Parametro');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateParametro(parametro: Parametro): Promise<{ data: boolean, message: string }> {
    try {
      if (!parametro.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Parametro no tiene la estructura esperada.');
      }
      let sql = parametro.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Parametro');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default ParametroNegocio;