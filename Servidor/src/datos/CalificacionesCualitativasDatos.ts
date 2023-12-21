import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import CalificacionesCualitativasEntidad from '../entidades/CalificacionesCualitativasEntidad';
import { v4 as uuidv4 } from 'uuid';

class CalificacionesCualitativasDatos {
  static sqlInsert: string = `INSERT INTO calificaciones_cualitativas (CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRD_ID, CALIFICACION, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE calificaciones_cualitativas SET PRF_ASG_PRLL_ID=?,EST_CRS_PRLL_ID=?,PRD_ID=?,CALIFICACION=?,ESTADO=? WHERE CAL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE calificaciones_cualitativas SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  CAL_ID IN';
  static sqlDelete: string = `DELETE FROM calificaciones_cualitativas WHERE CAL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM calificaciones_cualitativas ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM calificaciones_cualitativas WHERE CAL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM calificaciones_cualitativas WHERE ESTADO = 1 ORDER BY ESTADO DESC';
  static sqlGetByEstAsg: string = `SELECT * FROM calificaciones_cualitativas WHERE PRF_ASG_PRLL_ID =? AND EST_CRS_PRLL_ID =? AND PRD_ID =?`;

  static async insert(calificaciones_cualitativas: CalificacionesCualitativasEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      calificaciones_cualitativas.CAL_ID = uuidv4();
      const newCalificacionesCualitativas = new CalificacionesCualitativasEntidad(calificaciones_cualitativas.CAL_ID, calificaciones_cualitativas.PRF_ASG_PRLL_ID, calificaciones_cualitativas.EST_CRS_PRLL_ID, calificaciones_cualitativas.PRD_ID, calificaciones_cualitativas.CALIFICACION, calificaciones_cualitativas.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newCalificacionesCualitativas.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar CalificacionesCualitativas');
      }
      return { response: true, data: newCalificacionesCualitativas.CAL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(calificaciones_cualitativas: CalificacionesCualitativasEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newCalificacionesCualitativas = new CalificacionesCualitativasEntidad(calificaciones_cualitativas.CAL_ID, calificaciones_cualitativas.PRF_ASG_PRLL_ID, calificaciones_cualitativas.EST_CRS_PRLL_ID, calificaciones_cualitativas.PRD_ID, calificaciones_cualitativas.CALIFICACION, calificaciones_cualitativas.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newCalificacionesCualitativas.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar CalificacionesCualitativas');
      }
      return { response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
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

      return { response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo CalificacionesCualitativas');
      }
      return { response: true, data: true, message: 'Objeto eliminado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlSelect;

      const [rows] = await pool.execute<any>(sql);
      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para CalificacionesCualitativas.');
      }
      return { response: true, data: rows as CalificacionesCualitativasEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo CalificacionesCualitativas no encontrado');
      }
      let newCalificacionesCualitativas = rows[0] as CalificacionesCualitativasEntidad;
      return { response: true, data: newCalificacionesCualitativas, message: 'Encontrado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetEnabled;

      const [rows] = await pool.execute<any>(sql);
      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para CalificacionesCualitativas.');
      }
      return { response: true, data: rows as CalificacionesCualitativasEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getByEstAsg(data: any): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetByEstAsg;

      const [rows] = await pool.execute<any>(sql, [data.PRF_ASG_PRLL_ID, data.EST_CRS_PRLL_ID, data.PRD_ID]);

      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para CalificacionesCualitativas.');
      }
      return { response: true, data: rows[0] as CalificacionesCualitativasEntidad, message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}
export default CalificacionesCualitativasDatos;
