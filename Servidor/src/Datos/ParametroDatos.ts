
import pool from '../System/Conexion/BaseDatos';
import { Respuesta } from '../System/Interfaces/Respuesta';
import ParametroEntidad from '../Entidades/ParametroEntidad';
import { v4 as uuidv4 } from 'uuid';

class ParametroDatos {

  static sqlInsert: string = `INSERT INTO parametro (PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE parametro SET PRMT_NOM=?,PRMT_DESCR=?,PRMT_URL_IMG=?,ESTADO=? WHERE PRMT_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE parametro SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRMT_ID IN';
  static sqlDelete: string = `DELETE FROM parametro WHERE PRMT_ID = ?`;
  static sqlSelect: string = `SELECT * FROM parametro`;
  static sqlGetById: string = 'SELECT * FROM parametro WHERE PRMT_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM parametro WHERE ESTADO = 1';
  
  
  static async insert(parametro: ParametroEntidad ): Promise<Respuesta> {
    try {
      parametro.PRMT_ID = uuidv4(); //asigna un identificador unico
      
      const newParametro = new ParametroEntidad(parametro.PRMT_ID, parametro.PRMT_NOM, parametro.PRMT_DESCR, parametro.PRMT_URL_IMG, parametro.ESTADO, parametro.CREADOR_ID);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newParametro.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Parametro');
      }
      return {response: true, data:newParametro.PRMT_ID, message: 'Se creo correctamente' }; // Retorna el ID del Parametro
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(parametro: ParametroEntidad): Promise<Respuesta> {
    try {
      const newParametro = new ParametroEntidad(parametro.PRMT_ID, parametro.PRMT_NOM, parametro.PRMT_DESCR, parametro.PRMT_URL_IMG, parametro.ESTADO, parametro.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newParametro.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Parametro');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
    
  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN y actualización del estado
      let sql = `${this.sqlUpdateEstado}(${placeholders});`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, ids);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudo actualizar el estado');
      }

      return {response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message };
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Parametro');
      }
      return { response: true, data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as ParametroEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Parametro no encontrado');
      }
      let newParametro = rows[0] as ParametroEntidad;
      return {response: true, data: newParametro, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      

      const [rows] = await pool.execute<any>(sql);
      return {response: false, data: rows as ParametroEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  


}
export default ParametroDatos;
