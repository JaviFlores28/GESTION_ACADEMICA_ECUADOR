
import pool from '../sistema/Conexion/BaseDatos';
import { Respuesta } from '../sistema/Interfaces/Respuesta';
import ParcialEntidad from '../Entidades/ParcialEntidad';
import { v4 as uuidv4 } from 'uuid';

class ParcialDatos {
  static sqlInsert: string = `INSERT INTO parcial (PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE parcial SET PRCL_NOM=?,PRCL_INI=?,PRCL_FIN=?,ESTADO=?,PRCL_TIPO=?,PRD_ID=? WHERE PRCL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE parcial SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRCL_ID IN';
  static sqlDelete: string = `DELETE FROM parcial WHERE PRCL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM parcial `;
  static sqlGetById: string = 'SELECT * FROM parcial WHERE PRCL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM parcial WHERE ESTADO = 1';
  
  
  static async insert(parcial: ParcialEntidad ): Promise<Respuesta> {
    try {
      parcial.PRCL_ID = uuidv4(); //asigna un identificador unico
      
      const newParcial = new ParcialEntidad(parcial.PRCL_ID, parcial.PRCL_NOM, parcial.PRCL_INI, parcial.PRCL_FIN, parcial.ESTADO, parcial.PRCL_TIPO, parcial.PRD_ID, parcial.CREADOR_ID);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newParcial.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Parcial');
      }
      return {response: true, data:newParcial.PRCL_ID, message: 'Se creo correctamente' }; // Retorna el ID del Parcial
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(parcial: ParcialEntidad): Promise<Respuesta> {
    try {
      const newParcial = new ParcialEntidad(parcial.PRCL_ID, parcial.PRCL_NOM, parcial.PRCL_INI, parcial.PRCL_FIN, parcial.ESTADO, parcial.PRCL_TIPO, parcial.PRD_ID, parcial.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newParcial.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Parcial');
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
        throw new Error('No se pudo eliminar el objeto de tipo Parcial');
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
      return { response: true, data: rows as ParcialEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Parcial no encontrado');
      }
      let newParcial = rows[0] as ParcialEntidad;
      return {response: true, data: newParcial, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ParcialEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  


}
export default ParcialDatos;
