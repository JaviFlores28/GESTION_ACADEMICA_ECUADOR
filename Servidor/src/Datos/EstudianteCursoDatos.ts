import pool from '../sistema/Conexion/BaseDatos';
import { Respuesta } from '../sistema/Interfaces/Respuesta';
import EstudianteCursoEntidad from '../Entidades/EstudianteCursoEntidad';
import { v4 as uuidv4 } from 'uuid';

class EstudianteCursoDatos {
  static sqlInsert: string = `INSERT INTO estudiante_curso (EST_CRS_ID, EST_ID, CRS_ID, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE estudiante_curso SET EST_ID=?,CRS_ID=?,ESTADO=? WHERE EST_CRS_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE estudiante_curso SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  EST_CRS_ID IN';
  static sqlDelete: string = `DELETE FROM estudiante_curso WHERE EST_CRS_ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_estudiante_curso `;
  static sqlGetById: string = 'SELECT * FROM estudiante_curso WHERE EST_CRS_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_estudiante_curso WHERE ESTADO = 1';
  static sqlGetNoMatriculados: string = 'SELECT a.* FROM vista_estudiante AS a WHERE NOT EXISTS ( SELECT 1 FROM estudiante_curso AS b WHERE b.EST_ID = a.EST_ID AND (b.ESTADO = 1 OR b.CRS_ID = (SELECT CRS_ID FROM curso ORDER BY CRS_ORDEN DESC LIMIT 1)) ) AND a.ESTADO = 1;';
  static sqlGetMatriculas: string = 'SELECT E.*, ec.EST_CRS_ID FROM vista_estudiante E JOIN ESTUDIANTE_CURSO EC ON E.EST_ID = EC.EST_ID JOIN CURSO C ON EC.CRS_ID = C.CRS_ID WHERE EC.ESTADO = 1 AND C.CRS_ID = ?;';

  static async insert(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      estudiante_curso.EST_CRS_ID = uuidv4(); //asigna un identificador unico

      const newEstudianteCurso = new EstudianteCursoEntidad(estudiante_curso.EST_CRS_ID, estudiante_curso.EST_ID, estudiante_curso.CRS_ID, estudiante_curso.ESTADO, estudiante_curso.CREADOR_ID);

      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newEstudianteCurso.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar EstudianteCurso');
      }
      return { response: true, data: newEstudianteCurso.EST_CRS_ID, message: 'Se creo correctamente' }; // Retorna el ID del EstudianteCurso
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async update(estudiante_curso: EstudianteCursoEntidad): Promise<Respuesta> {
    try {
      const newEstudianteCurso = new EstudianteCursoEntidad(estudiante_curso.EST_CRS_ID, estudiante_curso.EST_ID, estudiante_curso.CRS_ID, estudiante_curso.ESTADO, estudiante_curso.CREADOR_ID);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newEstudianteCurso.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar EstudianteCurso');
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
        throw new Error('No se pudo eliminar el objeto de tipo EstudianteCurso');
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
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo EstudianteCurso no encontrado');
      }
      let newEstudianteCurso = rows[0] as EstudianteCursoEntidad;
      return { response: true, data: newEstudianteCurso, message: 'Encontrado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;

      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }

  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetNoMatriculados;
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetMatriculas;
      const [rows] = await pool.execute<any>(sql, [id]);
      return { response: true, data: rows as EstudianteCursoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }
  static async insertMasivo(data: any): Promise<Respuesta> {
    try {
      const arrayIds = data.arrayIds;
      const estado = 1;

      // Crear un array de valores para todos los registros utilizando map
      const valores = arrayIds.map((id: any) => [uuidv4(), id, data.CRS_ID, estado, data.CREADOR_ID]);
      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores.map((fila: string | any[]) => `(${Array.from({ length: fila.length }, () => '?').join(',')})`).join(',');

      const campos = ['EST_CRS_ID', 'EST_ID', 'CRS_ID', 'ESTADO', 'CREADOR_ID'].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = `INSERT INTO estudiante_curso (${campos}) VALUES ${placeholders};`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar las matrículas');
      }

      return { response: true, data: true, message: 'Matrículas insertadas correctamente' };
    } catch (error: any) {
      return { response: false, data: false, message: error.code };
    }
  }
}
export default EstudianteCursoDatos;
