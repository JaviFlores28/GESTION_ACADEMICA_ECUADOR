
import pool from '../Datos/BaseDatos';
import Periodo from '../Entidades/PeriodoEntidad';
import { v4 as uuidv4 } from 'uuid';


class PeriodoNegocio {
  
  static async getPeriodo(): Promise<{ data: Periodo[], message: string }> {
    try {
      let sql = 'SELECT * FROM periodo';
      const [rows] = await pool.execute<any>(sql);
      return { data: rows as Periodo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledPeriodo(): Promise<{ data: Periodo[], message: string }> {
    try {
      let sql = 'SELECT * FROM periodo where Estado=1';
      const [rows] = await pool.execute<any>(sql);
      return { data: rows as Periodo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Periodo | null; message: string }> {
    try {
      let sql = 'SELECT * FROM periodo WHERE PRD_ID = ?';
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Periodo no encontrado');
      }
      let newPeriodo = rows[0] as Periodo;
      
      return { data: newPeriodo, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addPeriodo(periodo: Periodo): Promise<{ data: string | null, message: string }> {
    try {
      if (!periodo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Periodo no tiene la estructura esperada.');
      }
      periodo.PRD_ID = uuidv4(); //asigna un identificador unico
      let sql = periodo.sqlInsert();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Periodo');
      }
      return { data:periodo.PRD_ID, message: 'Se creo correctamente' }; // Retorna el ID del Periodo
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deletePeriodo(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM periodo WHERE PRD_ID = ?';
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Periodo');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updatePeriodo(periodo: Periodo): Promise<{ data: boolean, message: string }> {
    try {
      if (!periodo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Periodo no tiene la estructura esperada.');
      }
      let sql = periodo.sqlUpdate();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Periodo');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default PeriodoNegocio;