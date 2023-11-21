import pool from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import AsignaturaEntidad from '../entidades/AsignaturaEntidad';
import { v4 as uuidv4 } from 'uuid';

class AsignaturaDatos {
  static sqlInsert: string = `INSERT INTO asignatura (ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE asignatura SET ASG_NOM=?,ASG_TIPO=?,AREA_ID=?,ESTADO=? WHERE ASG_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE asignatura SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ASG_ID IN';
  static sqlDelete: string = `DELETE FROM asignatura WHERE ASG_ID = ?`;
  static sqlSelect: string = `SELECT * FROM asignatura `;
  static sqlGetById: string = 'SELECT * FROM asignatura WHERE ASG_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM asignatura WHERE ESTADO = 1';

  static async insert(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      asignatura.ASG_ID = uuidv4(); //asigna un identificador unico

      const newAsignatura = new AsignaturaEntidad(asignatura.ASG_ID, asignatura.ASG_NOM, asignatura.ASG_TIPO, asignatura.AREA_ID, asignatura.ESTADO, asignatura.CREADOR_ID);

      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newAsignatura.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Asignatura');
      }
      return { response: true, data: newAsignatura.ASG_ID, message: 'Se creo correctamente' }; // Retorna el ID del Asignatura
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(asignatura: AsignaturaEntidad): Promise<Respuesta> {
    try {
      const newAsignatura = new AsignaturaEntidad(asignatura.ASG_ID, asignatura.ASG_NOM, asignatura.ASG_TIPO, asignatura.AREA_ID, asignatura.ESTADO, asignatura.CREADOR_ID);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newAsignatura.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Asignatura');
      }
      return { response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
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

      return { response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Asignatura');
      }
      return { response: true, data: true, message: 'Objeto eliminado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;

      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as AsignaturaEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Asignatura no encontrado');
      }
      let newAsignatura = rows[0] as AsignaturaEntidad;
      return { response: true, data: newAsignatura, message: 'Encontrado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;

      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as AsignaturaEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
}
export default AsignaturaDatos;
