import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import ProfesorAsignaturaParaleloEntidad from '../entidades/ProfesorAsignaturaParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';

class ProfesorAsignaturaParaleloDatos {
  static sqlInsert: string = `INSERT INTO profesor_asignatura_paralelo (PRF_ASG_PRLL_ID, ASG_ID, PRF_ID, AL_ID, CRS_ID, PRLL_ID, ESTADO)VALUES(?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE profesor_asignatura_paralelo SET ASG_ID=?,PRF_ID=?,AL_ID=?,CRS_ID=?,PRLL_ID=?,ESTADO=? WHERE PRF_ASG_PRLL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE profesor_asignatura_paralelo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRF_ASG_PRLL_ID  =?;';
  static sqlDelete: string = `DELETE FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_profesor_asignatura_paralelo `;
  static sqlGetById: string = 'SELECT * FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_profesor_asignatura_paralelo WHERE ESTADO = 1 ';
  static sqlGetByPrf: string = 'SELECT a.* FROM vista_profesor_asignatura_paralelo as a JOIN profesor_asignatura_paralelo as b ON a.PRF_ASG_PRLL_ID = b.PRF_ASG_PRLL_ID WHERE b.ESTADO = 1 AND b.AL_ID = ? AND b.PRF_ID = ?;';

  static async insert(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      profesor_asignatura_paralelo.PRF_ASG_PRLL_ID = uuidv4();
      const newProfesorAsignaturaParalelo = new ProfesorAsignaturaParaleloEntidad(profesor_asignatura_paralelo.PRF_ASG_PRLL_ID, profesor_asignatura_paralelo.ASG_ID, profesor_asignatura_paralelo.PRF_ID, profesor_asignatura_paralelo.AL_ID, profesor_asignatura_paralelo.CRS_ID, profesor_asignatura_paralelo.PRLL_ID, profesor_asignatura_paralelo.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newProfesorAsignaturaParalelo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ProfesorAsignaturaParalelo');
      }
      return { response: true, data: newProfesorAsignaturaParalelo.PRF_ASG_PRLL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newProfesorAsignaturaParalelo = new ProfesorAsignaturaParaleloEntidad(profesor_asignatura_paralelo.PRF_ASG_PRLL_ID, profesor_asignatura_paralelo.ASG_ID, profesor_asignatura_paralelo.PRF_ID, profesor_asignatura_paralelo.AL_ID, profesor_asignatura_paralelo.CRS_ID, profesor_asignatura_paralelo.PRLL_ID, profesor_asignatura_paralelo.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newProfesorAsignaturaParalelo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ProfesorAsignaturaParalelo');
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
        throw new Error('No se pudo eliminar el objeto de tipo ProfesorAsignaturaParalelo');
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
        throw new Error('No se encontraron datos para ProfesorAsignaturaParalelo.');
      }
      return { response: true, data: rows as ProfesorAsignaturaParaleloEntidad[], message: '' };
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
        throw new Error('Objeto de tipo ProfesorAsignaturaParalelo no encontrado');
      }
      let newProfesorAsignaturaParalelo = rows[0] as ProfesorAsignaturaParaleloEntidad;
      return { response: true, data: newProfesorAsignaturaParalelo, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para ProfesorAsignaturaParalelo.');
      }
      return { response: true, data: rows as ProfesorAsignaturaParaleloEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
  static async getByPrf(data: any): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetByPrf;
      const [rows] = await pool.execute<any>(sql, [data.AL_ID, data.PRF_ID]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo ProfesorAsignaturaParalelo no encontrado');
      }
      return { response: true, data: rows as ProfesorAsignaturaParaleloEntidad[], message: 'Encontrado' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
  static async insertMasivo(data: any): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      const arrayIds = data.arrayIds;

      // Crear un array de valores para todos los registros utilizando map
      const valores = arrayIds.map((id: any) => [uuidv4(), id, data.PRF_ID, data.AL_ID, data.CRS_ID, data.PRLL_ID, data.ESTADO]);

      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores.map((fila: string | any[]) => `(${Array.from({ length: fila.length }, () => '?').join(',')})`).join(',');

      const campos = ['PRF_ASG_PRLL_ID', 'ASG_ID', 'PRF_ID', 'AL_ID', 'CRS_ID', 'PRLL_ID', 'ESTADO'].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = `INSERT INTO profesor_asignatura_paralelo (${campos}) VALUES ${placeholders};`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar los datos');
      }
      return { response: true, data: true, message: 'Datos insertados correctamente' };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.message = 'Entrada duplicada. Ya existe un registro con ese valor.';
      }
      return { response: false, data: false, message: error.message };
    }
  }
}
export default ProfesorAsignaturaParaleloDatos;
