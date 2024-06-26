import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import ParcialEntidad from '../entidades/ParcialEntidad';
import { v4 as uuidv4 } from 'uuid';

class ParcialDatos {
  static sqlInsert: string = `INSERT INTO parcial (PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID)VALUES(?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE parcial SET PRCL_NOM=?,PRCL_INI=?,PRCL_FIN=?,ESTADO=?,PRCL_TIPO=?,PRD_ID=? WHERE PRCL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE parcial SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRCL_ID  =?;';
  static sqlDelete: string = `DELETE FROM parcial WHERE PRCL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM parcial ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM parcial WHERE PRCL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM parcial WHERE ESTADO = 1 ORDER BY ESTADO DESC';
  static sqlGetByPeriodo: string = 'SELECT * FROM parcial WHERE PRD_ID = ? AND ESTADO = 1 ';

  static async insert(parcial: ParcialEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      parcial.PRCL_ID = uuidv4();
      const newParcial = new ParcialEntidad(parcial.PRCL_ID, parcial.PRCL_NOM, parcial.PRCL_INI, parcial.PRCL_FIN, parcial.ESTADO, parcial.PRCL_TIPO, parcial.PRD_ID);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newParcial.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Parcial');
      }
      return { response: true, data: newParcial.PRCL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(parcial: ParcialEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newParcial = new ParcialEntidad(parcial.PRCL_ID, parcial.PRCL_NOM, parcial.PRCL_INI, parcial.PRCL_FIN, parcial.ESTADO, parcial.PRCL_TIPO, parcial.PRD_ID);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newParcial.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Parcial');
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
        throw new Error('No se pudo eliminar el objeto de tipo Parcial');
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
        throw new Error('No se encontraron datos para Parcial.');
      }
      return { response: true, data: rows as ParcialEntidad[], message: '' };
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
        throw new Error('Objeto de tipo Parcial no encontrado');
      }
      let newParcial = rows[0] as ParcialEntidad;
      return { response: true, data: newParcial, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para Parcial.');
      }
      return { response: true, data: rows as ParcialEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async getByPeriodo(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetByPeriodo;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Parcial no encontrado');
      }
      return { response: true, data: rows as ParcialEntidad[], message: 'Encontrado' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
}
export default ParcialDatos;
