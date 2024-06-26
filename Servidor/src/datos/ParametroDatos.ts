import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import ParametroEntidad from '../entidades/ParametroEntidad';
import { v4 as uuidv4 } from 'uuid';

class ParametroDatos {
  static sqlInsert: string = `INSERT INTO parametro (PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO)VALUES(?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE parametro SET PRMT_NOM=?,PRMT_DESCR=?,PRMT_URL_IMG=?,ESTADO=? WHERE PRMT_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE parametro SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRMT_ID  =?;';
  static sqlDelete: string = `DELETE FROM parametro WHERE PRMT_ID = ?`;
  static sqlSelect: string = `SELECT * FROM parametro ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM parametro WHERE PRMT_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM parametro WHERE ESTADO = 1 ORDER BY ESTADO DESC';

  static async insert(parametro: ParametroEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      parametro.PRMT_ID = uuidv4();
      const newParametro = new ParametroEntidad(parametro.PRMT_ID, parametro.PRMT_NOM, parametro.PRMT_DESCR, parametro.PRMT_URL_IMG, parametro.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newParametro.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Parametro');
      }
      return { response: true, data: newParametro.PRMT_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(parametro: ParametroEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newParametro = new ParametroEntidad(parametro.PRMT_ID, parametro.PRMT_NOM, parametro.PRMT_DESCR, parametro.PRMT_URL_IMG, parametro.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newParametro.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Parametro');
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
        throw new Error('No se pudo eliminar el objeto de tipo Parametro');
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
        throw new Error('No se encontraron datos para Parametro.');
      }
      return { response: true, data: rows as ParametroEntidad[], message: '' };
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
        throw new Error('Objeto de tipo Parametro no encontrado');
      }
      let newParametro = rows[0] as ParametroEntidad;
      return { response: true, data: newParametro, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para Parametro.');
      }
      return { response: true, data: rows as ParametroEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
}
export default ParametroDatos;
