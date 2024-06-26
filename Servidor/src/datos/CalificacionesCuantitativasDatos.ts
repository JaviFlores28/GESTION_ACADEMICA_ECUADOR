import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import CalificacionesCuantitativasEntidad from '../entidades/CalificacionesCuantitativasEntidad';
import { v4 as uuidv4 } from 'uuid';

class CalificacionesCuantitativasDatos {
  static sqlInsert: string = `INSERT INTO calificaciones_cuantitativas (CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRCL_ID, CALIFICACION,ESTADO)VALUES(?, ?, ?, ?, ?,?);`;
  static sqlUpdate: string = `UPDATE calificaciones_cuantitativas SET PRF_ASG_PRLL_ID=?,EST_CRS_PRLL_ID=?,PRCL_ID=?,CALIFICACION=?, ESTADO=? WHERE CAL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE calificaciones_cuantitativas SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  CAL_ID  =?;';
  static sqlDelete: string = `DELETE FROM calificaciones_cuantitativas WHERE CAL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM calificaciones_cuantitativas ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM calificaciones_cuantitativas WHERE CAL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM calificaciones_cuantitativas WHERE ESTADO = 1 ORDER BY ESTADO DESC';
  static sqlGetByEstAsg: string = `SELECT * FROM calificaciones_cuantitativas WHERE PRF_ASG_PRLL_ID =? AND EST_CRS_PRLL_ID =? AND PRCL_ID =?`;

  static async insert(calificaciones_cuantitativas: CalificacionesCuantitativasEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      calificaciones_cuantitativas.CAL_ID = uuidv4();
      const newCalificacionesCuantitativas = new CalificacionesCuantitativasEntidad(calificaciones_cuantitativas.CAL_ID, calificaciones_cuantitativas.PRF_ASG_PRLL_ID, calificaciones_cuantitativas.EST_CRS_PRLL_ID, calificaciones_cuantitativas.PRCL_ID, calificaciones_cuantitativas.CALIFICACION, calificaciones_cuantitativas.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newCalificacionesCuantitativas.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar CalificacionesCuantitativas');
      }
      return { response: true, data: newCalificacionesCuantitativas.CAL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(calificaciones_cuantitativas: CalificacionesCuantitativasEntidad): Promise<Respuesta> {
    try {
      console.log(calificaciones_cuantitativas);

      const pool = await BaseDatos.getInstanceDataBase();

      const newCalificacionesCuantitativas = new CalificacionesCuantitativasEntidad(calificaciones_cuantitativas.CAL_ID, calificaciones_cuantitativas.PRF_ASG_PRLL_ID, calificaciones_cuantitativas.EST_CRS_PRLL_ID, calificaciones_cuantitativas.PRCL_ID, calificaciones_cuantitativas.CALIFICACION, calificaciones_cuantitativas.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newCalificacionesCuantitativas.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar CalificacionesCuantitativas');
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
        throw new Error('No se pudo eliminar el objeto de tipo CalificacionesCuantitativas');
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
        throw new Error('No se encontraron datos para CalificacionesCuantitativas.');
      }
      return { response: true, data: rows as CalificacionesCuantitativasEntidad[], message: '' };
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
        throw new Error('Objeto de tipo CalificacionesCuantitativas no encontrado');
      }
      let newCalificacionesCuantitativas = rows[0] as CalificacionesCuantitativasEntidad;
      return { response: true, data: newCalificacionesCuantitativas, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para CalificacionesCuantitativas.');
      }
      return { response: true, data: rows as CalificacionesCuantitativasEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async getByEstAsg(data: any): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetByEstAsg;

      const [rows] = await pool.execute<any>(sql, [data.PRF_ASG_PRLL_ID, data.EST_CRS_PRLL_ID, data.PRCL_ID]);

      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para CalificacionesCualitativas.');
      }
      return { response: true, data: rows[0] as CalificacionesCuantitativasDatos, message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
}
export default CalificacionesCuantitativasDatos;
