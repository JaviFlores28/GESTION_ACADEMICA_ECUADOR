import pool from '../sistema/Conexion/BaseDatos';
import { Respuesta } from '../sistema/Interfaces/Respuesta';
import AreaEntidad from '../Entidades/AreaEntidad';
import { v4 as uuidv4 } from 'uuid';

class AreaDatos {
  static sqlInsert: string = `INSERT INTO area (AREA_ID, AREA_NOM, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE area SET AREA_NOM=?,ESTADO=? WHERE AREA_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE area SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  AREA_ID IN';
  static sqlDelete: string = `DELETE FROM area WHERE AREA_ID = ?`;
  static sqlSelect: string = `SELECT * FROM area `;
  static sqlGetById: string = 'SELECT * FROM area WHERE AREA_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM area WHERE ESTADO = 1';

  static async insert(area: AreaEntidad): Promise<Respuesta> {
    try {
      area.AREA_ID = uuidv4(); //asigna un identificador unico

      const newArea = new AreaEntidad(area.AREA_ID, area.AREA_NOM, area.ESTADO, area.CREADOR_ID);

      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newArea.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Area');
      }
      return { response: true, data: newArea.AREA_ID, message: 'Se creo correctamente' }; // Retorna el ID del Area
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(area: AreaEntidad): Promise<Respuesta> {
    try {
      const newArea = new AreaEntidad(area.AREA_ID, area.AREA_NOM, area.ESTADO, area.CREADOR_ID);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newArea.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Area');
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
        throw new Error('No se pudo eliminar el objeto de tipo Area');
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
      return { response: true, data: rows as AreaEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Area no encontrado');
      }
      let newArea = rows[0] as AreaEntidad;
      return { response: true, data: newArea, message: 'Encontrado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;

      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as AreaEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
}
export default AreaDatos;
