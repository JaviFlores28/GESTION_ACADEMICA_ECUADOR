import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import ParaleloEntidad from '../entidades/ParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';

class ParaleloDatos {
  static sqlInsert: string = `INSERT INTO paralelo (PRLL_ID, PRLL_NOM, ESTADO)VALUES(?, ?, ?);`;
  static sqlUpdate: string = `UPDATE paralelo SET PRLL_NOM=?,ESTADO=? WHERE PRLL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE paralelo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRLL_ID  =?;';
  static sqlDelete: string = `DELETE FROM paralelo WHERE PRLL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM paralelo ORDER BY PRLL_NOM ASC`;
  static sqlGetById: string = 'SELECT * FROM paralelo WHERE PRLL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM paralelo WHERE ESTADO = 1 ORDER BY PRLL_NOM ASC';

  static async insert(paralelo: ParaleloEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      paralelo.PRLL_ID = uuidv4();
      const newParalelo = new ParaleloEntidad(paralelo.PRLL_ID, paralelo.PRLL_NOM, paralelo.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newParalelo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Paralelo');
      }
      return { response: true, data: newParalelo.PRLL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(paralelo: ParaleloEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newParalelo = new ParaleloEntidad(paralelo.PRLL_ID, paralelo.PRLL_NOM, paralelo.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newParalelo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Paralelo');
      }
      return { response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(id: string): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlUpdateEstado;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows < 1) {
        throw new Error('No se pudo actualizar el estado');
      }
      return { response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Paralelo');
      }
      return { response: true, data: true, message: 'Objeto eliminado' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlSelect;

      const [rows] = await pool.execute<any>(sql);
      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para Paralelo.');
      }
      return { response: true, data: rows as ParaleloEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Paralelo no encontrado');
      }
      let newParalelo = rows[0] as ParaleloEntidad;
      return { response: true, data: newParalelo, message: 'Encontrado' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetEnabled;

      const [rows] = await pool.execute<any>(sql);
      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para Paralelo.');
      }
      return { response: true, data: rows as ParaleloEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
}
export default ParaleloDatos;
