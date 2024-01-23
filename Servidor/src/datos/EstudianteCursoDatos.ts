import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import EstudianteCursoEntidad from '../entidades/EstudianteCursoEntidad';
import { v4 as uuidv4 } from 'uuid';

class EstudianteCursoDatos {
  static sqlInsert: string = `INSERT INTO estudiante_curso (EST_CRS_ID, EST_ID, CRS_ID, ESTADO)VALUES(?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE estudiante_curso SET EST_ID=?,CRS_ID=?,ESTADO=? WHERE EST_CRS_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE estudiante_curso SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  EST_CRS_ID  =?;';
  static sqlUpdateEstadoMasivo: string = 'UPDATE estudiante_curso SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  EST_CRS_ID IN';
  static sqlDelete: string = `DELETE FROM estudiante_curso WHERE EST_CRS_ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_estudiante_curso `;
  static sqlGetById: string = 'SELECT * FROM estudiante_curso WHERE EST_CRS_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_estudiante_curso WHERE ESTADO = 1 ';
  static sqlGetNoMatriculados: string = 'SELECT a.* FROM vista_estudiante AS a LEFT JOIN estudiante_curso AS b ON b.EST_ID = a.EST_ID AND (b.ESTADO = 1 OR b.CRS_ID = (SELECT CRS_ID FROM curso ORDER BY CRS_ORDEN DESC LIMIT 1)) WHERE A.ESTADO=1 AND b.EST_ID IS NULL ORDER BY a.EST_NOM ASC;';
  static sqlGetByCurso: string = 'SELECT A.* FROM vista_estudiante_curso A INNER JOIN estudiante_curso B ON A.EST_CRS_ID = B.EST_CRS_ID LEFT JOIN estudiante_curso_paralelo ECP ON A.EST_CRS_ID = ECP.EST_CRS_ID AND ECP.ESTADO = 1 WHERE A.ESTADO = 1 AND B.CRS_ID = ? AND ECP.EST_CRS_ID IS NULL;';

  static async insert(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      estudiante_curso.EST_CRS_ID = uuidv4();
      const newEstudianteCurso = new EstudianteCursoEntidad(estudiante_curso.EST_CRS_ID, estudiante_curso.EST_ID, estudiante_curso.CRS_ID, estudiante_curso.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newEstudianteCurso.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar EstudianteCurso');
      }
      return { response: true, data: newEstudianteCurso.EST_CRS_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newEstudianteCurso = new EstudianteCursoEntidad(estudiante_curso.EST_CRS_ID, estudiante_curso.EST_ID, estudiante_curso.CRS_ID, estudiante_curso.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newEstudianteCurso.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar EstudianteCurso');
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

  static async updateEstadoMasivo(ids: string[]): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN y actualización del estado
      let sql = `${this.sqlUpdateEstadoMasivo}(${placeholders});`;

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
        throw new Error('No se pudo eliminar el objeto de tipo EstudianteCurso');
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
        throw new Error('No se encontraron datos para EstudianteCurso.');
      }
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
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
        throw new Error('Objeto de tipo EstudianteCurso no encontrado');
      }
      let newEstudianteCurso = rows[0] as EstudianteCursoEntidad;
      return { response: true, data: newEstudianteCurso, message: 'Encontrado' };
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
        throw new Error('No se encontraron datos para EstudianteCurso.');
      }
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }

  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetNoMatriculados;
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
    } catch (error: any) {
      error.message = Funciones.mapErrorCodeToMessage(error.code, error.message);
      return { response: false, data: null, message: error.message };
    }
  }
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetByCurso;
      const [rows] = await pool.execute<any>(sql, [id]);
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
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
      const valores = arrayIds.map((id: any) => [uuidv4(), id, data.CRS_ID, data.ESTADO]);

      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores.map((fila: string | any[]) => `(${Array.from({ length: fila.length }, () => '?').join(',')})`).join(',');

      const campos = ['EST_CRS_ID', 'EST_ID', 'CRS_ID', 'ESTADO'].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = `INSERT INTO estudiante_curso (${campos}) VALUES ${placeholders};`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar los datos');
      }

      return { response: true, data: true, message: 'Datos insertados correctamente' };
    } catch (error: any) {
      return { response: false, data: false, message: error.message };
    }
  }
}
export default EstudianteCursoDatos;
