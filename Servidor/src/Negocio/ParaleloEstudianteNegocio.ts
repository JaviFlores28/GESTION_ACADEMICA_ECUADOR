
import pool from '../Datos/BaseDatos';
import ParaleloEstudiante from '../Entidades/ParaleloEstudianteEntidad';
import { v4 as uuidv4 } from 'uuid';


class ParaleloEstudianteNegocio {

  static async getParaleloEstudiante(): Promise<{ data: ParaleloEstudiante[], message: string }> {
    try {
      let sql = 'SELECT * FROM paralelo_estudiante';
      const [rows] = await pool.execute<any>(sql);
      return { data: rows as ParaleloEstudiante[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledParaleloEstudiante(paraleloiD:string): Promise<{ data: ParaleloEstudiante[], message: string }> {
    try {
      let sql = 'SELECT a.PRLL_EST_ID as id,  c.EST_ID, c.EST_DNI, concat (c.EST_NOM,\' \', c.EST_NOM2,\' \',c.EST_APE,\' \',c.EST_APE2) AS EST_NOM FROM paralelo_estudiante a JOIN matricula b ON a.MTR_ID = b.MTR_ID JOIN estudiante c ON b.EST_ID = c.EST_ID WHERE a.PRLL_ID = ? AND a.ESTADO = 1;';
      const [rows] = await pool.execute<any>(sql,[paraleloiD]);
      return { data: rows as ParaleloEstudiante[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async searchById(id: String): Promise<{ data: ParaleloEstudiante | null; message: string }> {
    try {
      let sql = 'SELECT * FROM paralelo_estudiante WHERE PRLL_EST_ID = ?';
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo ParaleloEstudiante no encontrado');
      }
      let newParaleloEstudiante = rows[0] as ParaleloEstudiante;

      return { data: newParaleloEstudiante, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async addParaleloEstudiante(paralelo_estudiante: ParaleloEstudiante): Promise<{ data: string | null, message: string }> {
    try {
      if (!paralelo_estudiante.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo ParaleloEstudiante no tiene la estructura esperada.');
      }
      paralelo_estudiante.PRLL_EST_ID = uuidv4(); //asigna un identificador unico
      let sql = paralelo_estudiante.sqlInsert();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ParaleloEstudiante');
      }
      return { data: paralelo_estudiante.PRLL_EST_ID, message: 'Se creo correctamente' }; // Retorna el ID del ParaleloEstudiante
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async deleteParaleloEstudiante(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM paralelo_estudiante WHERE PRLL_EST_ID = ?';
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo ParaleloEstudiante');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async updateParaleloEstudiante(paralelo_estudiante: ParaleloEstudiante): Promise<{ data: boolean, message: string }> {
    try {
      if (!paralelo_estudiante.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo ParaleloEstudiante no tiene la estructura esperada.');
      }
      let sql = paralelo_estudiante.sqlUpdate();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ParaleloEstudiante');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

}
export default ParaleloEstudianteNegocio;