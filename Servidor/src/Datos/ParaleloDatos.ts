
import pool from '../System/Conexion/BaseDatos';
import { Respuesta } from '../System/Interfaces/Respuesta';
import ParaleloEntidad from '../Entidades/ParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';

class ParaleloDatos {

  static sqlInsert: string = `INSERT INTO paralelo (PRLL_ID, PRLL_NOM, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE paralelo SET PRLL_NOM=?,ESTADO=? WHERE PRLL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE paralelo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRLL_ID IN';
  static sqlDelete: string = `DELETE FROM paralelo WHERE PRLL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM paralelo`;
  static sqlGetById: string = 'SELECT * FROM paralelo WHERE PRLL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM paralelo WHERE ESTADO = 1';
  
  
  static async insert(paralelo: ParaleloEntidad ): Promise<Respuesta> {
    try {
      paralelo.PRLL_ID = uuidv4(); //asigna un identificador unico
      
      const newParalelo = new ParaleloEntidad(paralelo.PRLL_ID, paralelo.PRLL_NOM, paralelo.ESTADO, paralelo.CREADOR_ID);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newParalelo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Paralelo');
      }
      return {response: true, data:newParalelo.PRLL_ID, message: 'Se creo correctamente' }; // Retorna el ID del Paralelo
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(paralelo: ParaleloEntidad): Promise<Respuesta> {
    try {
      const newParalelo = new ParaleloEntidad(paralelo.PRLL_ID, paralelo.PRLL_NOM, paralelo.ESTADO, paralelo.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newParalelo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Paralelo');
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
        throw new Error('No se pudo eliminar el objeto de tipo Paralelo');
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
      return { response: true, data: rows as ParaleloEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Paralelo no encontrado');
      }
      let newParalelo = rows[0] as ParaleloEntidad;
      return {response: true, data: newParalelo, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      

      const [rows] = await pool.execute<any>(sql);
      return {response: false, data: rows as ParaleloEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  


}
export default ParaleloDatos;
