import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad';
import { v4 as uuidv4 } from 'uuid';

class UsuarioProfesorDatos {
  static sqlInsert: string = `INSERT INTO usuario_profesor (DTLL_PRF_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG, USR_ID)VALUES(?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE usuario_profesor SET PRF_FECH_INGR_INST=?,PRF_FECH_INGR_MAG=?,USR_ID=? WHERE DTLL_PRF_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE usuario_profesor SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  DTLL_PRF_ID IN';
  static sqlDelete: string = `DELETE FROM usuario_profesor WHERE DTLL_PRF_ID = ?`;
  static sqlSelect: string = `SELECT * FROM usuario_profesor ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM usuario_profesor WHERE DTLL_PRF_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM usuario_profesor WHERE ESTADO = 1 ORDER BY ESTADO DESC';

  static async insert(usuario_profesor: UsuarioProfesorEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newUsuarioProfesor = new UsuarioProfesorEntidad(usuario_profesor.USR_ID, usuario_profesor.PRF_FECH_INGR_INST, usuario_profesor.PRF_FECH_INGR_MAG);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newUsuarioProfesor.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar UsuarioProfesor');
      }
      return { response: true, data: newUsuarioProfesor.USR_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(usuario_profesor: UsuarioProfesorEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newUsuarioProfesor = new UsuarioProfesorEntidad(usuario_profesor.USR_ID, usuario_profesor.PRF_FECH_INGR_INST, usuario_profesor.PRF_FECH_INGR_MAG);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newUsuarioProfesor.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar UsuarioProfesor');
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
        throw new Error('No se pudo eliminar el objeto de tipo UsuarioProfesor');
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
        throw new Error('No se encontraron datos para UsuarioProfesor.');
      }
      return { response: true, data: rows as UsuarioProfesorEntidad[], message: '' };
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
        throw new Error('Objeto de tipo UsuarioProfesor no encontrado');
      }
      let newUsuarioProfesor = rows[0] as UsuarioProfesorEntidad;
      return { response: true, data: newUsuarioProfesor, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para UsuarioProfesor.');
      }
      return { response: true, data: rows as UsuarioProfesorEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }
}
export default UsuarioProfesorDatos;
