import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import PeriodoEntidad from '../entidades/PeriodoEntidad';
import { v4 as uuidv4 } from 'uuid';

class PeriodoDatos {
  static sqlInsert: string = `INSERT INTO periodo (PRD_ID, PRD_NOM, PRD_INI, PRD_FIN, PRD_TIPO, AL_ID, ESTADO)VALUES(?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE periodo SET PRD_NOM=?,PRD_INI=?,PRD_FIN=?,PRD_TIPO=?,AL_ID=?,ESTADO=? WHERE PRD_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE periodo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRD_ID IN';
  static sqlDelete: string = `DELETE FROM periodo WHERE PRD_ID = ?`;
  static sqlSelect: string = `SELECT * FROM periodo ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM periodo WHERE PRD_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM periodo WHERE ESTADO = 1 ORDER BY ESTADO DESC';

  static async insert(periodo: PeriodoEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      periodo.PRD_ID = uuidv4();
      const newPeriodo = new PeriodoEntidad(periodo.PRD_ID, periodo.PRD_NOM, periodo.PRD_INI, periodo.PRD_FIN, periodo.PRD_TIPO, periodo.AL_ID, periodo.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newPeriodo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Periodo');
      }
      return { response: true, data: newPeriodo.PRD_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(periodo: PeriodoEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newPeriodo = new PeriodoEntidad(periodo.PRD_ID, periodo.PRD_NOM, periodo.PRD_INI, periodo.PRD_FIN, periodo.PRD_TIPO, periodo.AL_ID, periodo.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newPeriodo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Periodo');
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
        throw new Error('No se pudo eliminar el objeto de tipo Periodo');
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
        throw new Error('No se encontraron datos para Periodo.');
      }
      return { response: true, data: rows as PeriodoEntidad[], message: '' };
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
        throw new Error('Objeto de tipo Periodo no encontrado');
      }
      let newPeriodo = rows[0] as PeriodoEntidad;
      return { response: true, data: newPeriodo, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para Periodo.');
      }
      return { response: true, data: rows as PeriodoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}
export default PeriodoDatos;
