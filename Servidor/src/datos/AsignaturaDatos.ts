import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import AsignaturaEntidad from '../entidades/AsignaturaEntidad';
import { v4 as uuidv4 } from 'uuid';

class AsignaturaDatos {
  static sqlInsert: string = `INSERT INTO asignatura (ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO)VALUES(?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE asignatura SET ASG_NOM=?,ASG_TIPO=?,AREA_ID=?,ESTADO=? WHERE ASG_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE asignatura SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ASG_ID =?;';
  static sqlDelete: string = `DELETE FROM asignatura WHERE ASG_ID = ?`;
  static sqlSelect: string = `SELECT * FROM asignatura ORDER BY ESTADO DESC, ASG_TIPO DESC, ASG_NOM ASC;`;
  static sqlGetById: string = 'SELECT * FROM asignatura WHERE ASG_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM asignatura WHERE ESTADO = 1 ORDER BY ESTADO DESC';

  static async insert(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      asignatura.ASG_ID = uuidv4();
      const newAsignatura = new AsignaturaEntidad(asignatura.ASG_ID, asignatura.ASG_NOM, asignatura.ASG_TIPO, asignatura.AREA_ID, asignatura.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newAsignatura.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Asignatura');
      }
      return { response: true, data: newAsignatura.ASG_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newAsignatura = new AsignaturaEntidad(asignatura.ASG_ID, asignatura.ASG_NOM, asignatura.ASG_TIPO, asignatura.AREA_ID, asignatura.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newAsignatura.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Asignatura');
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
        throw new Error('No se pudo eliminar el objeto de tipo Asignatura');
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
        throw new Error('No se encontraron datos para Asignatura.');
      }
      return { response: true, data: rows as AsignaturaEntidad[], message: '' };
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
        throw new Error('Objeto de tipo Asignatura no encontrado');
      }
      let newAsignatura = rows[0] as AsignaturaEntidad;
      return { response: true, data: newAsignatura, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para Asignatura.');
      }
      return { response: true, data: rows as AsignaturaEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
}
export default AsignaturaDatos;
