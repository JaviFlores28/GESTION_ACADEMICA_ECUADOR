
import Funciones from '../sistema/funciones/Funciones';
import pool from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import ProfesorAsignaturaParaleloEntidad from '../entidades/ProfesorAsignaturaParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';

class ProfesorAsignaturaParaleloDatos {
  
  static sqlInsert: string = `INSERT INTO profesor_asignatura_paralelo (PRF_ASG_PRLL_ID, PRF_ID, AL_ID, ASG_ID, CRS_ID, PRLL_ID, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE profesor_asignatura_paralelo SET PRF_ID=?,AL_ID=?,ASG_ID=?,CRS_ID=?,PRLL_ID=?,ESTADO=? WHERE PRF_ASG_PRLL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE profesor_asignatura_paralelo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  PRF_ASG_PRLL_ID IN';
  static sqlDelete: string = `DELETE FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM profesor_asignatura_paralelo ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM profesor_asignatura_paralelo WHERE ESTADO = 1 ORDER BY ESTADO DESC';
  
  
  static async insert(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad ): Promise<Respuesta> {
    try {
      
      profesor_asignatura_paralelo.PRF_ASG_PRLL_ID = uuidv4(); 
      const newProfesorAsignaturaParalelo = new ProfesorAsignaturaParaleloEntidad(profesor_asignatura_paralelo.PRF_ASG_PRLL_ID, profesor_asignatura_paralelo.PRF_ID, profesor_asignatura_paralelo.AL_ID, profesor_asignatura_paralelo.ASG_ID, profesor_asignatura_paralelo.CRS_ID, profesor_asignatura_paralelo.PRLL_ID, profesor_asignatura_paralelo.ESTADO, profesor_asignatura_paralelo.CREADOR_ID);
      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newProfesorAsignaturaParalelo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ProfesorAsignaturaParalelo');
      }
      return {response: true, data:newProfesorAsignaturaParalelo.PRF_ASG_PRLL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async update(profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad): Promise<Respuesta> {
    try {
      const newProfesorAsignaturaParalelo = new ProfesorAsignaturaParaleloEntidad(profesor_asignatura_paralelo.PRF_ASG_PRLL_ID, profesor_asignatura_paralelo.PRF_ID, profesor_asignatura_paralelo.AL_ID, profesor_asignatura_paralelo.ASG_ID, profesor_asignatura_paralelo.CRS_ID, profesor_asignatura_paralelo.PRLL_ID, profesor_asignatura_paralelo.ESTADO, profesor_asignatura_paralelo.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newProfesorAsignaturaParalelo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ProfesorAsignaturaParalelo');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message: error.code }; 
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

      return {response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message: error.code };
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo ProfesorAsignaturaParalelo');
      }
      return { response: true, data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return { response: false, data: null, message: error.code }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as ProfesorAsignaturaParaleloEntidad[], message: '' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return { response: false, data: null, message: error.code }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo ProfesorAsignaturaParalelo no encontrado');
      }
      let newProfesorAsignaturaParalelo = rows[0] as ProfesorAsignaturaParaleloEntidad;
      return {response: true, data: newProfesorAsignaturaParalelo, message: 'Encontrado' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message: error.code }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ProfesorAsignaturaParaleloEntidad[], message: '' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message: error.code }; 
    }
  }
  
}
export default ProfesorAsignaturaParaleloDatos;
