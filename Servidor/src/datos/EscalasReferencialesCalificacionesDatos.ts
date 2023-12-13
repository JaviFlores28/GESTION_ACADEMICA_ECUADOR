import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import EscalasReferencialesCalificacionesEntidad from '../entidades/EscalasReferencialesCalificacionesEntidad';
import { v4 as uuidv4 } from 'uuid';

class EscalasReferencialesCalificacionesDatos {
  static sqlInsert: string = `INSERT INTO escalas_referenciales_calificaciones (ESCL_ID, ESCL_ABRV, ESCL_DESCR, ESCL_INI, ESCL_FIN)VALUES(?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE escalas_referenciales_calificaciones SET ESCL_ABRV=?,ESCL_DESCR=?,ESCL_INI=?,ESCL_FIN=? WHERE ESCL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE escalas_referenciales_calificaciones SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ESCL_ID IN';
  static sqlDelete: string = `DELETE FROM escalas_referenciales_calificaciones WHERE ESCL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM escalas_referenciales_calificaciones ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM escalas_referenciales_calificaciones WHERE ESCL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM escalas_referenciales_calificaciones WHERE ESTADO = 1 ORDER BY ESTADO DESC';

  static async insert(escalas_referenciales_calificaciones: EscalasReferencialesCalificacionesEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      escalas_referenciales_calificaciones.ESCL_ID = uuidv4();
      const newEscalasReferencialesCalificaciones = new EscalasReferencialesCalificacionesEntidad(escalas_referenciales_calificaciones.ESCL_ID, escalas_referenciales_calificaciones.ESCL_ABRV, escalas_referenciales_calificaciones.ESCL_DESCR, escalas_referenciales_calificaciones.ESCL_INI, escalas_referenciales_calificaciones.ESCL_FIN);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newEscalasReferencialesCalificaciones.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar EscalasReferencialesCalificaciones');
      }
      return { response: true, data: newEscalasReferencialesCalificaciones.ESCL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(escalas_referenciales_calificaciones: EscalasReferencialesCalificacionesEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newEscalasReferencialesCalificaciones = new EscalasReferencialesCalificacionesEntidad(escalas_referenciales_calificaciones.ESCL_ID, escalas_referenciales_calificaciones.ESCL_ABRV, escalas_referenciales_calificaciones.ESCL_DESCR, escalas_referenciales_calificaciones.ESCL_INI, escalas_referenciales_calificaciones.ESCL_FIN);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newEscalasReferencialesCalificaciones.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar EscalasReferencialesCalificaciones');
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
        throw new Error('No se pudo eliminar el objeto de tipo EscalasReferencialesCalificaciones');
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
        throw new Error('No se encontraron datos para EscalasReferencialesCalificaciones.');
      }
      return { response: true, data: rows as EscalasReferencialesCalificacionesEntidad[], message: '' };
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
        throw new Error('Objeto de tipo EscalasReferencialesCalificaciones no encontrado');
      }
      let newEscalasReferencialesCalificaciones = rows[0] as EscalasReferencialesCalificacionesEntidad;
      return { response: true, data: newEscalasReferencialesCalificaciones, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para EscalasReferencialesCalificaciones.');
      }
      return { response: true, data: rows as EscalasReferencialesCalificacionesEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}
export default EscalasReferencialesCalificacionesDatos;
