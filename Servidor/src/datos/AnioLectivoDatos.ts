import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/Interfaces/Respuesta';
import AnioLectivoEntidad from '../entidades/AnioLectivoEntidad';
import { v4 as uuidv4 } from 'uuid';

class AnioLectivoDatos {
  static sqlInsert: string = `INSERT INTO anio_lectivo (AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN_MIN_APR, CLFN_MIN_PERD, PRD_NOM, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE anio_lectivo SET AL_NOM=?,AL_INICIO=?,AL_FIN=?,AL_POR_PRD=?,AL_POR_EXAM=?,CLFN_MIN_APR=?,CLFN_MIN_PERD=?,PRD_NOM=?,NUM_PRD=?,NUM_EXAM=?,NUM_PRCL=?,NUM_SUSP=?,ESTADO=? WHERE AL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE anio_lectivo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  AL_ID IN';
  static sqlDelete: string = `DELETE FROM anio_lectivo WHERE AL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM anio_lectivo ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM anio_lectivo WHERE AL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM anio_lectivo WHERE ESTADO = 1 ORDER BY ESTADO DESC';

  static async insert(anio_lectivo: AnioLectivoEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      anio_lectivo.AL_ID = uuidv4();
      const newAnioLectivo = new AnioLectivoEntidad(anio_lectivo.AL_ID, anio_lectivo.AL_NOM, anio_lectivo.AL_INICIO, anio_lectivo.AL_FIN, anio_lectivo.AL_POR_PRD, anio_lectivo.AL_POR_EXAM, anio_lectivo.CLFN_MIN_APR, anio_lectivo.CLFN_MIN_PERD, anio_lectivo.PRD_NOM, anio_lectivo.NUM_PRD, anio_lectivo.NUM_EXAM, anio_lectivo.NUM_PRCL, anio_lectivo.NUM_SUSP, anio_lectivo.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newAnioLectivo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar AnioLectivo');
      }
      return { response: true, data: newAnioLectivo.AL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(anio_lectivo: AnioLectivoEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newAnioLectivo = new AnioLectivoEntidad(anio_lectivo.AL_ID, anio_lectivo.AL_NOM, anio_lectivo.AL_INICIO, anio_lectivo.AL_FIN, anio_lectivo.AL_POR_PRD, anio_lectivo.AL_POR_EXAM, anio_lectivo.CLFN_MIN_APR, anio_lectivo.CLFN_MIN_PERD, anio_lectivo.PRD_NOM, anio_lectivo.NUM_PRD, anio_lectivo.NUM_EXAM, anio_lectivo.NUM_PRCL, anio_lectivo.NUM_SUSP, anio_lectivo.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newAnioLectivo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar AnioLectivo');
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
        throw new Error('No se pudo eliminar el objeto de tipo AnioLectivo');
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
        throw new Error('No se encontraron datos para AnioLectivo.');
      }
      return { response: true, data: rows as AnioLectivoEntidad[], message: '' };
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
        throw new Error('Objeto de tipo AnioLectivo no encontrado');
      }
      let newAnioLectivo = rows[0] as AnioLectivoEntidad;
      return { response: true, data: newAnioLectivo, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para AnioLectivo.');
      }
      return { response: true, data: rows as AnioLectivoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}
export default AnioLectivoDatos;
