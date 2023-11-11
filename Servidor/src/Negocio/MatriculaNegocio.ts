
import pool from '../Datos/BaseDatos';
import Estudiante from '../Entidades/EstudianteEntidad';
import Matricula from '../Entidades/MatriculaEntidad';
import { v4 as uuidv4 } from 'uuid';


class MatriculaNegocio {

  static async getMatricula(): Promise<{ data: Matricula[], message: string }> {
    try {
      let sql = `SELECT a.MTR_ID as id, CONCAT(b.CRS_NOM, '-', b.CRS_TIPO) as CRS, CONCAT(c.EST_NOM, ' ', c.EST_NOM2, ' ', c.EST_APE, ' ', c.EST_APE2) as EST_NOM, a.ESTADO, a.PASE FROM matricula as a JOIN curso as b ON a.CRS_ID = b.CRS_ID JOIN estudiante as c ON a.EST_ID = c.EST_ID;`;
      const [rows] = await pool.execute<any>(sql);
      return { data: rows as Matricula[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledMatricula(): Promise<{ data: Matricula[], message: string }> {
    try {
      let sql = `SELECT a.MTR_ID as id, CONCAT(b.CRS_NOM, '-', b.CRS_TIPO) as CRS, CONCAT(c.EST_NOM, ' ', c.EST_NOM2, ' ', c.EST_APE, ' ', c.EST_APE2) as EST_NOM, a.ESTADO, a.PASE FROM matricula as a JOIN curso as b ON a.CRS_ID = b.CRS_ID JOIN estudiante as c ON a.EST_ID = c.EST_ID WHERE a.ESTADO = 1;`;
      const [rows] = await pool.execute<any>(sql);
      return { data: rows as Matricula[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledMatriculaByCurso(cursoid: any): Promise<{ data: Estudiante[], message: string }> {
    try {
      let sql = `SELECT b.EST_ID AS id, b.EST_DNI, CONCAT(b.EST_NOM,' ', b.EST_NOM2,' ',b.EST_APE,' ',b.EST_APE2) AS EST_NOM FROM matricula as a JOIN estudiante as b ON a.EST_ID = b.EST_ID WHERE a.CRS_ID = ? AND b.ESTADO = 1 AND NOT EXISTS ( SELECT 1 FROM paralelo_estudiante as mp, paralelo as pr, anio_lectivo as al WHERE mp.MTR_ID = a.MTR_ID and mp.PRLL_ID=pr.PRLL_ID and pr.AL_ID=al.AL_ID and al.ESTADO=1 );`;
      console.log(sql, cursoid);
      const [rows] = await pool.execute<any>(sql, [cursoid]);
      return { data: rows as Estudiante[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async searchById(id: String): Promise<{ data: Matricula | null; message: string }> {
    try {
      let sql = 'SELECT * FROM matricula WHERE MTR_ID = ?';
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Matricula no encontrado');
      }
      let newMatricula = rows[0] as Matricula;

      return { data: newMatricula, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async addMatricula(matricula: Matricula): Promise<{ data: string | null, message: string }> {
    try {
      if (!matricula.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Matricula no tiene la estructura esperada.');
      }
      matricula.MTR_ID = uuidv4(); //asigna un identificador unico
      let sql = matricula.sqlInsert();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Matricula');
      }
      return { data: matricula.MTR_ID, message: 'Se creo correctamente' }; // Retorna el ID del Matricula
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async deleteMatricula(ids: string[]): Promise<{ data: boolean, message: string }> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN
      let sql = `DELETE FROM matricula WHERE MTR_ID IN (${placeholders})`;

      // Ejecutar la consulta con el array de IDs
      const [result] = await pool.execute<any>(sql, ids);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron eliminar las matrículas');
      }

      return { data: true, message: 'Matrículas eliminadas' };
    } catch (error: any) {
      return { data: false, message: error.message };
    }
  }


  static async updateEstadoMatricula(ids: string[], estado: string): Promise<{ data: boolean, message: string }> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN y actualización del estado
      let sql = `UPDATE matricula SET ESTADO = ? WHERE MTR_ID IN (${placeholders});`;

      // Crear un array que incluya el estado y los IDs
      const values = [estado, ...ids];

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, values);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron actualizar las matrículas');
      }

      return { data: true, message: 'Matrículas actualizadas' };
    } catch (error: any) {
      return { data: false, message: error.message };
    }
  }


  static async updateMatricula(matricula: Matricula): Promise<{ data: boolean, message: string }> {
    try {
      if (!matricula.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Matricula no tiene la estructura esperada.');
      }
      let sql = matricula.sqlUpdate();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Matricula');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

}
export default MatriculaNegocio;